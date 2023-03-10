import {
  doc,
  getDoc,
  Timestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { dbService } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditorComponent from "../../components/write/TextEditor";
import baseImg from "../../public/images/test1.png";
import Image from "next/image";
import { convertTimestamp } from "../../util";
import { authService } from "../../config/firebase";
import useGetUserProfileNickName from "../../hooks/useGetUserProfileNickName";
import Comments from "../../components/communityPage/Comments";
import { toast } from "react-toastify";
import { AppProps } from "next/app";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Seo from "../../components/layout/Seo";

interface propsType extends AppProps {
  targetWholeData: communityPostType;
  targetId: string;
}

export default function DetailPage(props: propsType) {
  const [detailPageWholeData, setDetailPageWholeData]: any = useState({});
  const [isPostEdit, setIsPostEdit] = useState(false);
  const [uid, setUid] = useState("");
  const [commentWriterNickName, setCommentWriterNickName] = useState("");
  const [commentProfile, setCommentProfile] = useState("");
  const writterUID = props.targetWholeData.uid;

  const { userNickName: writterNickName, userProfileURL: writterProfile } =
    useGetUserProfileNickName(writterUID);

  const boardId = props.targetId;

  const router = useRouter();
  //여기 게시글
  const [editPostTitle, setEditPostTitle] = useState(
    props.targetWholeData.title
  );
  const [editPostContent, setEditPostContent] = useState(
    props.targetWholeData.editorText
  );

  useEffect(() => {
    const sessionStorageUser = sessionStorage.getItem("User") || "";
    if (sessionStorageUser) {
      const parsingUser = JSON.parse(sessionStorageUser);
      if (authService.currentUser) {
        setCommentProfile(authService.currentUser.photoURL as string);
      }
      setUid(parsingUser?.uid);
      setCommentWriterNickName(parsingUser?.displayName);
    }
    if (!sessionStorageUser) {
      setUid("guest");
    }

    //전체 데이터 set함수
    setDetailPageWholeData(props.targetWholeData);
  }, []);

  // 글 수정
  const updatePost = async (postId: string) => {
    setIsPostEdit(!isPostEdit);
    const docRef = doc(dbService, "communityPost", postId);
    await updateDoc(docRef, {
      title: editPostTitle,
      editorText: editPostContent,
      writtenDate: Timestamp.now(),
    });

    getDoc(doc(dbService, "communityPost", postId)).then((doc) => {
      const data: any = doc.data();
      setDetailPageWholeData({
        title: data.title,
        editorText: data.editorText,
        writtenDate: convertTimestamp(data.writtenDate),
      });
    });
  };

  const deletePost = async (postId: string) => {
    const userConfirm = window.confirm("해당 글을 삭제하시겠습니까?");
    if (userConfirm) {
      try {
        await deleteDoc(doc(dbService, "communityPost", postId));
        router.back();
      } catch (error) {
        toast.error("삭제에 실패하였습니다. 다시 시도해주세요.");
      }
    }
  };

  const moveMain = () => {
    location.href = "/community";
  };

  return (
    <div className="bg-[#FFF6EA] sm:py-16 py-0">
      <Seo title="커뮤니티" />
      <div
        className="sm:pt-[75px] rounded-md pt-16 px-7 pb-7 container sm:w-[780px] mx-auto flex justify-center flex-col bg-[#fffdfa]
      ]"
      >
        <div className="flex justify-between items-center pb-[24px]">
          <span className="sm:text-lg text-xl">
            {detailPageWholeData.category}게시판
          </span>
          <button
            onClick={moveMain}
            type="button"
            className="bg-brand100 text-mono30 px-2 py-1 rounded-sm text-sm focus:outline-none ring-offset-2 hover:ring-2 ring-brand100"
          >
            글목록
          </button>
        </div>

        <hr className="mt-[15px] h-px my-2 bg-brand100 border-[2px] border-brand100"></hr>
        <div>
          {isPostEdit ? (
            <>
              <div className="p-3">
                <div className="text-mono100 pb-2 ml-1">
                  <span>글제목</span>
                </div>
                <input
                  className="border w-[320px] mb-3 text-[14px] p-3 rounded-[2px] border-mono60 text-mono80"
                  type="text"
                  value={editPostTitle}
                  onChange={(e) => {
                    setEditPostTitle(e.target.value);
                  }}
                />
                <div className="text-mono100 pb-2 ml-1">
                  <span>내용</span>
                </div>

                <EditorComponent
                  setEditorText={setEditPostContent}
                  editorText={editPostContent}
                />
              </div>
            </>
          ) : (
            <>
              <div className="sm:text-4xl text-2xl text-mono100 font-medium pt-[20px] sm:pt-[30px] mb-4">
                {detailPageWholeData.title}
              </div>
              <div className="flex justify-between items-center">
                <div className="h-[60px] flex items-center justify-center space-x-4">
                  {writterProfile === "null" ? (
                    <Image
                      className="w-[40px] h-[40px] object-cover object-center float-left rounded-md"
                      src={baseImg}
                      width={780}
                      height={270}
                      alt="대표 이미지가 없습니다."
                    />
                  ) : (
                    <Image
                      src={writterProfile}
                      loader={({ src }) => src}
                      width={100}
                      height={100}
                      alt="writterProfile"
                      className="w-[40px] h-[40px] object-cover object-center float-left rounded-md"
                    />
                  )}
                  <span className="text-base sm:text-lg">
                    {writterNickName}
                  </span>
                </div>
                <div className="text-sm text-mono80">
                  {detailPageWholeData.writtenDate}
                </div>
              </div>
              <hr className="h-px mt-5 mb-10 bg-mono50 border-[1px] border-mono50"></hr>
              <div className="mt-10 text-center">
                {/* 대표사진 */}
                {detailPageWholeData.thumbnail === "" ? (
                  <Image
                    className="sm:w-1/3 mb-10 m-auto rounded-sm"
                    src={baseImg}
                    width={780}
                    height={270}
                    alt="대표 이미지가 없습니다."
                  />
                ) : (
                  <Image
                    src={detailPageWholeData.thumbnail}
                    loader={({ src }) => src}
                    className="sm:w-1/3 mb-10 m-auto"
                    width={780}
                    height={270}
                    alt="커뮤썸네일"
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: detailPageWholeData.editorText,
                  }}
                />
              </div>
            </>
          )}
          {uid === props.targetWholeData.uid && (
            <div className="flex float-right mt-2 space-x-2">
              <button
                className="text-mono80 bg-mono50 text-sm sm:text-base px-2 py-1 rounded-md"
                onClick={() => updatePost(props.targetId)}
              >
                {isPostEdit ? "완료" : "수정"}
              </button>
              <button
                className="text-mono80 bg-mono50 text-sm sm:text-base px-2 py-1 rounded-md"
                onClick={() => deletePost(props.targetId)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <hr className="h-px my-8 bg-brand100 border-[1px] border-brand100"></hr>
        <div>
          <Comments boardId={boardId} uid={uid} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params } = context;
  const { id } = params as { [key: string]: string };
  const targetId = id;
  let targetWholeData;
  const snap = await getDoc(doc(dbService, "communityPost", targetId));
  if (snap.exists()) {
    targetWholeData = {
      ...snap.data(),
      writtenDate: convertTimestamp(snap.data().writtenDate),
    };
  } else {
    console.log("No such document");
  }
  if (targetWholeData) {
    targetWholeData = JSON.parse(JSON.stringify(targetWholeData));
  }
  return {
    props: {
      targetWholeData,
      targetId,
    },
  };
};
