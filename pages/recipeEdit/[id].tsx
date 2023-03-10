import { dbService } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { searchMovieTitle } from "@/api/tmdb";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import EditorComponent from "@/components/write/TextEditor";
import { toast, ToastContainer } from "react-toastify";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Seo from "../../components/layout/Seo";

interface TitleType {
  title: string;
}

const RecipeEditPage = ({
  targetWholeData,
  postId,
}: {
  targetWholeData: targetWholeDataType;
  postId: string;
}) => {
  const [searchTitle, setSeachTitle] = useState(targetWholeData.animationTitle);
  const [titleArr, setTitleArr] = useState<TitleType[]>([]);
  const [targetTitle, setTargetTitle] = useState(
    targetWholeData.animationTitle
  );
  const [foodTitle, setFoodTitle] = useState(targetWholeData.foodTitle);
  const [ingredient, setIngredient] = useState(targetWholeData.ingredient);
  const [selectCookTime, setSelectCookTime] = useState(
    targetWholeData.cookingTime
  );
  const [foodCategory, setFoodCategory] = useState(
    targetWholeData.foodCategory
  );
  const [displayStatus, setDisplayStatus] = useState("");
  const [imagePreview, setImagePreview] = useState(targetWholeData.thumbnail);
  const [thumbnail, setThumbnail] = useState(targetWholeData.thumbnail);
  const [editorText, setEditorText] = useState(targetWholeData.content);
  const [uid, setUid] = useState("");
  const movieTitleRef = useRef<HTMLInputElement>(null);
  const foodTitleRef = useRef<HTMLInputElement>(null);
  const ingredientRef = useRef<HTMLInputElement>(null);
  const cookTimeRef = useRef<HTMLSelectElement>(null);
  const foodCategoryRef = useRef<HTMLSelectElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [storageCurrentUser, setStorageCurrentUser] = useState<parseUserType>(
    {}
  );
  const [originImgThumbNail, setOriginImgThumbNail] = useState("");
  const [imgLoading, setImgLoading] = useState("default");

  useEffect(() => {
    const user = sessionStorage.getItem("User") || "";
    const parseUser = JSON.parse(user);
    setStorageCurrentUser(parseUser);
    setOriginImgThumbNail(targetWholeData?.thumbnail);
  }, []);

  const { data, refetch } = useQuery(["tmdb"], () => {
    return searchMovieTitle(searchTitle);
  });

  useEffect(() => {
    if (searchTitle) {
      refetch();
    }
    setTitleArr([]);
  }, [refetch, searchTitle]);

  useEffect(() => {
    if (data) {
      setTitleArr(data.results);
    }
  }, [data]);

  const toastAlert = (alertText: string) => {
    toast(`${alertText}`, {
      position: "top-right",
      autoClose: 1300,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const inputChangeSetFunc = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunction(event.target.value);
  };

  const selectChangeSetFunc = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunction(event.target.value);
  };

  const editPost = async (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();

    const newEditRecipe = {
      uid: storageCurrentUser?.uid,
      writerNickName: storageCurrentUser?.displayName, // auth.currentUser??? ?????? id
      animationTitle: targetTitle,
      foodTitle,
      ingredient,
      cookingTime: selectCookTime,
      foodCategory: foodCategory,
      displayStatus,
      thumbnail,
      createdAt: Date.now(),
      content: editorText,
      viewCount: 0,
      bookmarkCount: 0,
    };
    if (
      !targetTitle ||
      !foodTitle ||
      !ingredient ||
      !selectCookTime ||
      !foodCategory ||
      foodCategory == "none" ||
      selectCookTime == "none" ||
      !displayStatus ||
      !thumbnail ||
      !editorText ||
      !displayStatus ||
      editorText === "<p><br></p>"
    ) {
      if (!targetTitle) {
        toastAlert("???? ?????? ????????? ?????????????????? ????");
        movieTitleRef.current?.focus();
        return false;
      }
      if (!foodTitle) {
        toastAlert("???? ????????? ????????? ?????????????????? ????");
        foodTitleRef.current?.focus();
        return false;
      }
      if (!foodCategory || foodCategory == "none") {
        toastAlert("???? ?????? ????????? ??????????????????! ????");
        foodCategoryRef.current?.focus();
        return false;
      }

      if (!selectCookTime || selectCookTime == "none") {
        toastAlert("???? ?????? ????????? ?????????????????? ????");
        cookTimeRef.current?.focus();
        return false;
      }

      if (!ingredient) {
        toastAlert("???? ???????????? ?????????????????? ????");
        ingredientRef.current?.focus();
        return false;
      }

      if (!editorText) {
        toastAlert("???? ????????? ???????????? ????????????!????");
        return false;
      }

      if (!thumbnail) {
        toastAlert("???? ?????? ????????? ??????????????????! ????");
        thumbnailRef.current?.focus();
        return false;
      }
      if (!displayStatus) {
        toastAlert("???? ????????? ??????????????? ??????????????????! ????");
        return false;
      }
      alert("????????? ????????? ???????????? ???????????? ????");
      return false;
    }

    //---------update?????? ??????-------------------
    const docRef = doc(dbService, "recipe", postId);
    await updateDoc(docRef, {
      writerNickName: storageCurrentUser?.displayName, // auth.currentUser??? ?????? id
      animationTitle: targetTitle,
      foodTitle,
      ingredient,
      cookingTime: selectCookTime,
      foodCategory: foodCategory,
      displayStatus,
      thumbnail,
      createdAt: Date.now(),
      content: editorText,
    });

    //---------------------------------------
    toastAlert("????????? ????????? ?????????????????????.");
    setTimeout(() => {
      location.href = "/search";
    }, 1200);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const theFile = (target.files as FileList)[0];
    const reader: FileReader = new FileReader();
    if (theFile && theFile.type.match("image.*")) {
      reader.readAsDataURL(theFile);
    }
    reader.onloadend = (finishedEvent: ProgressEvent) => {
      const imgDataUrl = reader.result as string;
      localStorage.setItem("imgDataUrl", imgDataUrl);
      setImagePreview(imgDataUrl);
      setOriginImgThumbNail(imgDataUrl);
      addImageFirebase();
    };
  };

  const addImageFirebase = async () => {
    let randomID = Date.now();
    const imgRef = ref(storage, `newRecipeCoverPhoto${randomID}`);
    const imgDataUrl = localStorage.getItem("imgDataUrl");
    let downloadUrl: string;

    if (imgDataUrl) {
      setImgLoading("loading");
      const response = await uploadString(imgRef, imgDataUrl, "data_url");
      downloadUrl = await getDownloadURL(response.ref);
      toastAlert("?????? ????????? ???????????? ??????~!");
      await setImgLoading("loaded");
      setThumbnail(downloadUrl);
    }
  };

  return (
    <div className="mt-10 w-full h-full max-w-[1180px] flex flex-col items-center pt-2 mx-auto sm:p-10">
      <Seo title="????????? ??????" />
      <ToastContainer position="top-right" autoClose={1000} />
      <div className="mt-[75px] rounded-md p-7 container max-w-4/5 mx-auto flex justify-center flex-col">
        {/* <div className="mt-[75px] rounded-md p-7 container max-w-[1180px] mx-auto flex justify-center flex-col"> */}
        <h3 className="sm:text-4xl text-2xl font-bold">????????? ????????????</h3>
        <hr className="mt-[24px] h-px border-[1.5px] border-brand100"></hr>

        <form onSubmit={editPost} className="mt-[40px]">
          <div className="pb-7">
            <b className="text-[21px] font-semibold"> ??????????????? ?????? ?????? </b>
            <input
              value={searchTitle}
              className="p-2  sm:ml-[17px] sm:w-[280px] h-[45px] border border-mono60 rounded-[2px] "
              ref={movieTitleRef}
              name="targetTitle"
              type="text"
              onChange={(event) => inputChangeSetFunc(event, setSeachTitle)}
              placeholder="????????? ??????????????? ???????????????"
            />

            {searchTitle ? (
              <div className="ml-0 sm:ml-[6px] rounded-lg sm:w-[450px]  sm:text-center sm:mt-1">
                <select
                  className="sm:ml-[185px] w-[280px] h-[40px] mt-[16px] border border-mono60 rounded-[2px] text-center"
                  onChange={(event) => {
                    selectChangeSetFunc(event, setTargetTitle);
                  }}
                >
                  <option
                    value="defaultValue"
                    selected
                    style={{ display: "none" }}
                  >
                    ???? {searchTitle} ??? ????????? ?????? ?????? ????
                  </option>
                  {titleArr?.map((item, index) => (
                    <option value={item.title} key={index}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="space-y-3 mt-[20px]">
            <div className="pb-7 flex sm:flex-row flex-col">
              <div className="text-[21px] float-left font-semibold">
                ????????? ??????
              </div>
              <input
                className="p-2 lg:w-[580px] sm:w-[280px] md:w-[280px] sm:ml-[97px] text-mono70 h-[45px] border border-mono60 rounded-[2px]"
                value={foodTitle}
                ref={foodTitleRef}
                name="footTitle"
                type="text"
                onChange={(event) => inputChangeSetFunc(event, setFoodTitle)}
              />
            </div>
            <div className="pb-[40px] flex sm:flex-row flex-col">
              <div className="text-[21px] float-left font-semibold">
                ?????? ??????
              </div>
              <select
                className="p-2 sm:ml-[115px] ml-0 text-mono70 sm:w-[280px] h-[40px] border border-mono60 rounded-[2px]"
                ref={foodCategoryRef}
                onChange={(event) => {
                  selectChangeSetFunc(event, setFoodCategory);
                }}
              >
                <option value="none"> ?????? ?????? ?????? </option>
                <option value="???&???&??????">???/???/??????</option>
                <option value="??????&??????&???">??????/??????/???</option>
                <option value="?????????">?????????</option>
                <option value="????????????&?????????">????????????/?????????</option>
                <option value="??????&??????">??????/??????</option>
                <option value="???&?????????&???">???/?????????/???</option>
                <option value="??????&????????????">??????/????????????</option>
              </select>
            </div>
            <div className="pb-[40px]">
              <b className="text-[21px] font-semibold "> ???????????? </b>
              <select
                className="p-2 sm:ml-[115px] sm:w-[280px] text-mono70 w-full h-[40px] border border-mono60 rounded-[2px]"
                ref={cookTimeRef}
                onChange={(event) => {
                  selectChangeSetFunc(event, setSelectCookTime);
                }}
              >
                <option value="none"> ?????? ?????? ?????? ?????? </option>
                <option value="15?????????">15?????????</option>
                <option value="30?????????">30?????????</option>
                <option value="1????????????">1????????????</option>
                <option value="1????????????">1????????????</option>
              </select>
            </div>
            <hr className="h-px my-7 border-[1px] border-mono60"></hr>

            <div className="flex items-stretch pt-7 sm:flex-row flex-col">
              <div className="text-[21px] font-semibold">?????????</div>
              <input
                value={ingredient}
                type="text"
                ref={ingredientRef}
                name="ingredient"
                onChange={(event) => inputChangeSetFunc(event, setIngredient)}
                className="pb-[80px] p-2 ml-0 sm:ml-[135px] sm:w-[580px] sm:h-[117px] h-[150px] border border-mono60 rounded-[2px]"
              />
            </div>
          </div>
          <hr className="mt-[40px] border-[1px] border-mono60"></hr>
          <div className="pt-[40px] relative">
            <div className="text-[21px] pb-[40px] font-semibold">
              ????????? ??????
            </div>
            <div className="w-full sm:h-[538px] h-[300px]">
              <EditorComponent
                editorText={editorText}
                setEditorText={setEditorText}
              />
            </div>
            {imgLoading == "loading" && (
              <div className="flex items-center justify-center">
                <div className="text-center absolute rounded-lg flex bg-brand100 w-[500px] h-[200px]">
                  <div className="text-xl text-white m-auto">
                    ????????? ????????? ????????? ???????????? ????????? <br />
                    ????????? ?????????????????? !!!!
                  </div>
                </div>
              </div>
            )}

            <div className="bg-mono40 sm:h-[240px] h-[210px] sm:mt-[42px] mt-[70px]">
              <div className="mt-[12px] float-right sm:float-right flex items-stretch">
                <div className="mt-2 text-mono80 sm:text-[16px]">
                  ?????? ?????????
                </div>
                <label htmlFor="ex_file">
                  <div className="p-1 mr-2 rounded-[2px] border border-mono60 ml-[20px] sm:text-[16px] text-center pt-1 hover:cursor-pointer sm:w-[100px] sm:h-[35px] bg-mono40 text-mono100">
                    ????????? ??????
                  </div>
                </label>
                <input
                  id="ex_file"
                  className="hidden"
                  ref={thumbnailRef}
                  name="thumbnail"
                  onChange={(event) => {
                    onFileChange(event);
                  }}
                  type="file"
                  accept="images/*"
                />
              </div>
              <div className="text-[16px] ml-[16px] pt-[20px] text-mono100 ">
                ????????? ?????? ?????????
              </div>
              <Image
                className="ml-[16px] w-[82px] h-[49px] sm:w-[120px] sm:h-[80px] sm:pt-[16px]"
                loader={() => originImgThumbNail}
                src={originImgThumbNail}
                width={100}
                height={100}
                alt="?????? ????????? ?????? ????????? ??????????????????."
              />
              <div className="ml-[16px] pt-[28px] text-[16px] text-mono100">
                ?????? ??????
              </div>

              <div className="ml-[16px] flex items-stretch mt-[16px]">
                <div className="flex items-stretch">
                  <input
                    className="accent-brand100"
                    name="samename"
                    type="radio"
                    value="?????? ??????"
                    onClick={(event) => {
                      const target = event.target as HTMLInputElement;
                      setDisplayStatus(target.value);
                    }}
                  />

                  <h3 className="ml-2">?????? ??????</h3>
                </div>
                <div className="flex items-stretch ml-[32px]">
                  <input
                    className="accent-brand100"
                    name="samename"
                    type="radio"
                    value="?????? ??????"
                    onClick={(event) => {
                      const target = event.target as HTMLInputElement;
                      setDisplayStatus(target.value);
                    }}
                  />
                  <h3 className="ml-2">?????? ??????</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[40px] float-right">
            <button
              className="text-white w-[80px] sm:w-[180px] sm:h-[48px] bg-brand100 border border-mono60"
              type="submit"
            >
              ??????
            </button>
            <button
              onClick={() => {
                location.href = "/main";
              }}
              type="button"
              className="ml-[12px] w-[80px] sm:w-[180px] sm:h-[48px] border border-mono60"
            >
              ??????
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeEditPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let targetWholeData;
  const { params } = context;
  const { id } = params as { [key: string]: string };
  const postId = id;

  const snap = await getDoc(doc(dbService, "recipe", postId));
  if (snap.exists()) {
    targetWholeData = snap.data();
  } else {
    console.log("????????? ????????? ????????????.");
    return { props: {} };
  }

  if (targetWholeData) {
    targetWholeData = JSON.parse(JSON.stringify(targetWholeData));
  }

  return {
    props: {
      targetWholeData: targetWholeData || null,
      postId: postId || null,
    },
  };
};
