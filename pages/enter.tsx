import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce'

export default function Enter() {
  const {user, username} = useContext(UserContext);

  // three scenarios
  // 1. user signed out. show signinbutton
  // 2. user signed in, but missing username. show usernameform
  // 3. user signed in, has username. show signout button

  return (
    <main>
      {
        user ?
        !username ? <UsernameForm /> : <SignOutButton />
        :
        <SignInButton />
      }
    </main>
  )
}


// sign in with google
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" /> Sign in with Google
    </button>
  )
}

// sign out btn
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // create reference for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // commit both docs together as batch write
    const batch = firestore.batch();
    batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force format input
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // only set form value if length < 3 OR passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('Firestore read executed!');
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose username</h3>
        <form onSubmit={onSubmit}>
          <input type="text" name='username' placeholder='myname' value={formValue} onChange={onChange} />
          {/* error helper text */}
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type='submit' className='btn-green' disabled={!isValid}>
            Choose
          </button>

          <h3>Debug state</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Validating...</p>
  } else if (isValid) {
    return <p className='text-success'>{username} is available</p>;
  } else if (username && !isValid) {
    return <p className='text-danger'>That username is taken</p>;
  } else {
    return <p></p>
  }
}