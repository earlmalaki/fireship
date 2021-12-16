import React from "react";
import AuthCheck from "../../components/AuthCheck";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import styles from "../../styles/Admin.module.css";
import { auth } from "../../lib/firebase";
import ImageUploader from "../../components/ImageUploader";

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts",
    slug
  );

  const [post] = useDocumentDataOnce(postRef);

  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>{post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            ></PostForm>
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            {/* <DeletePostButton></DeletePostButton> */}
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ postRef, defaultValues, preview }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  // const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updateAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          name="content"
          {...(register("content"),
          {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content?.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          // disabled={!isDirty || isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
