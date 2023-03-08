import { cls } from "@/util";

const ChangeSortedBtn = ({
    text,
    currentItems,
    dataResults,
    isBest,
    activeBestBtn,
    inactiveBestBtn,
    filteredFood,
    filteredTime,
}: TypeSearchPageProps) => {
    // dataResults = 검색결과
    // totalItems = 전체레시피(6개씩)
    // currentItems = 전체레시피(총)

    const filteredFoodAndTime = filteredFood?.length && filteredTime?.length;
    const filteredOnlyFood = filteredFood?.length;
    const filteredOnlyTime = filteredTime?.length;

    return (
        <div className="w-4/5 md:flex justify-between items-center relative mb-[20px]">
            <ul className="flex justify-end absolute right-0">
                <li
                    className={cls(
                        "sorted-btn",
                        isBest === "viewCount"
                            ? "bg-brand100 text-white"
                            : "text-mono80"
                    )}
                    onClick={activeBestBtn}
                >
                    인기순
                </li>
                <li
                    className={cls(
                        "sorted-btn",
                        isBest === "createdAt"
                            ? "bg-brand100 text-white"
                            : "text-mono80"
                    )}
                    onClick={inactiveBestBtn}
                >
                    최신순
                </li>
            </ul>

            <p
                className={cls(
                    "text-white lg:text-mono100 flex items-center ml-4 lg:ml-5",
                    text ? "" : "hidden"
                )}
            >
                <span className="text-mono100 lg:text-white">
                    Results&nbsp;:&nbsp;
                </span>
                <span className="text-white lg:text-red100 text-lg inline-block mr-1">
                    {text ? `"${text}"` : null}
                </span>
                <span className="text-white lg:text-mono100">
                    {text ? `에 대한` : null}&nbsp;
                </span>
                <span className="text-red100 text-lg lg:text-base">
                    {dataResults
                        ? filteredFoodAndTime
                            ? dataResults.filter(
                                  (item) =>
                                      filteredFood.includes(
                                          item.foodCategory!
                                      ) ||
                                      filteredTime.includes(item.cookingTime!)
                              ).length
                            : filteredOnlyFood
                            ? dataResults.filter((item) =>
                                  filteredFood.includes(item.foodCategory!)
                              ).length
                            : filteredOnlyTime
                            ? dataResults.filter((item) =>
                                  filteredTime.includes(item.cookingTime!)
                              ).length
                            : dataResults.length
                        : null}
                </span>
                <span className="text-white lg:text-mono100">
                    건의 레시피가 준비되어 있습니다
                </span>
            </p>
            <p
                className={cls(
                    "text-white md:text-mono100",
                    dataResults?.length || (text && !dataResults?.length)
                        ? "hidden"
                        : ""
                )}
            >
                <span className="text-mono100 ml-7 lg:ml-10">Total&nbsp;</span>
                <span className="text-red100 text-lg">
                    {currentItems?.length
                        ? filteredFoodAndTime
                            ? currentItems.filter(
                                  (item) =>
                                      filteredFood.includes(
                                          item.foodCategory!
                                      ) ||
                                      filteredTime.includes(item.cookingTime!)
                              ).length
                            : filteredOnlyFood
                            ? currentItems.filter((item) =>
                                  filteredFood.includes(item.foodCategory!)
                              ).length
                            : filteredOnlyTime
                            ? currentItems.filter((item) =>
                                  filteredTime.includes(item.cookingTime!)
                              ).length
                            : currentItems.length
                        : 0}
                </span>
            </p>
        </div>
    );
};

export default ChangeSortedBtn;
