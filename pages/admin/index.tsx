import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import kebabcase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const postsRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = postsRef.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // ensure slug is url safe
  const slug = encodeURI(kebabcase(title));

  // validate length
  const isValid = title.length > 3 && title.length < 100;

  // create new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "#Hello World",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success("Post created");

    router.push(`admin/${slug}`);
  };

  return (
    <form onSubmit="{createPost}"></form>
  )
}


