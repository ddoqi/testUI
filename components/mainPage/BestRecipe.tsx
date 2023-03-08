import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import { dbService } from "@/config/firebase";
import RecipeList from "../searchPage/RecipeList";
import { useRouter } from "next/router";
import { clearStorage } from "../layout/Header";

const BestRecipe: NextPage = () => {
    const [dataResults, setDataResults] = useState<TypeRecipe[]>([]);
    const router = useRouter();
    const sortedBest = () => {
        router.push("/search");
        clearStorage();
        sessionStorage.setItem("userWatching", "viewCount");
    };

    const getList = async () => {
        const items = query(
            collection(dbService, "recipe"),
            orderBy("viewCount", "desc"),
            limit(3)
        );
        const querySnapshot = await getDocs(items);
        const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setDataResults(newData);
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <>
            <div className="space-y-4 flex flex-col items-center mb-7">
                <p className="text-3xl font-semibold">인기레시피</p>
                <p className="text-lg font-medium text-slate-500">
                    타쿠의 식탁에서 HOT한 요즘유행요리
                </p>
            </div>
            <div className="flex flex-col items-end">
                <button
                    onClick={sortedBest}
                    className="text-brand100 border border-brand100 w-[86px] h-[35px] mb-4 rounded-sm hover:bg-brand100 hover:text-white transition-all duration-200"
                >
                    더보기
                </button>
                <div className="grid mx-auto md:grid-cols-2 lg:mx-0 lg:grid-cols-3 gap-x-7 gap-y-9 relative pb-24">
                    <RecipeList dataResults={dataResults} />
                </div>
            </div>
        </>
    );
};

export default BestRecipe;
