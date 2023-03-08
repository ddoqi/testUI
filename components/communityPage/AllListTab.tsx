import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import Pagination from "./Pagination";
import Post from "./Post";
import useGetCommunityPost from "@/hooks/useGetCommunityPost";

const AllListTab = () => {
  const [communityList, setCommunityList] = useState<TCommunity[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  const { communityPost } = useGetCommunityPost();
  useEffect(() => {
    setCommunityList(communityPost);
  }, [communityPost]);

  return (
    <Tab.Panel>
      {communityList?.slice(offset, offset + limit).map((post) => (
        <Post post={post} key={post.id} />
      ))}
      <Pagination
        total={communityList.length}
        limit={limit}
        page={page}
        setPage={setPage}
      />
    </Tab.Panel>
  );
};

export default AllListTab;
