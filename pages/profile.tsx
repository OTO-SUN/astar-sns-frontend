import { ApiPromise } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useEffect, useState } from "react";

import BottomNavigation from "../components/bottomNavigation";
import Post from "../components/post";
import ProfileSettingModal from "../components/profileSettingModal";
import ProfileSubTopBar from "../components/profileSubTopBar";
import TopBar from "../components/topBar";
import { connectToContract } from "../hooks/connect";
import { balanceOf } from "../hooks/FT";
import type { PostType } from "../hooks/postFunction";
import { getIndividualPost } from "../hooks/postFunction";
import {
  checkCreatedInfo,
  createProfile,
  getFollowerList,
  getFollowingList,
  getProfileForProfile,
} from "../hooks/profileFunction";

const sleep = (waitMsec) => {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
};

export default function profile(props: any) {
  const [imgUrl, setImgUrl] = useState("");
  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false);
  const [name, setName] = useState("");
  const [individualPostList, setIndividualPostList] = useState<PostType[]>([]);

  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [api, setApi] = useState<ApiPromise>();
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>();
  const [followingList, setFollowingList] = useState<Array<string>>([]);
  const [followerList, setFollowerList] = useState<Array<string>>([]);
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    connectToContract({
      api: api,
      accountList: accountList,
      actingAccount: actingAccount!,
      isSetup: isSetup,
      setApi: setApi,
      setAccountList: setAccountList,
      setActingAccount: setActingAccount!,
      setIsSetup: setIsSetup,
    });
    sleep(500);
  }, []);

  useEffect(() => {
    if (!isSetup) return;
    console.log("isSetup");

    getProfileForProfile({
      api: api,
      userId: actingAccount?.address,
      setImgUrl: setImgUrl,
      setName: setName,
    });
    sleep(500);
    console.log("getProfileForProfile");

    getIndividualPost({
      api: api,
      actingAccount: actingAccount,
      setIndividualPostList: setIndividualPostList,
    });
    sleep(500);
    console.log("getIndividualPost");

    getFollowingList({
      api: api,
      userId: actingAccount?.address,
      setFollowingList: setFollowingList,
    });
    sleep(500);
    console.log("getFollowingList");

    getFollowerList({
      api: api,
      userId: actingAccount?.address,
      setFollowerList: setFollowerList,
    });
    sleep(500);
    console.log("getFollowerList");

    balanceOf({
      api: api,
      actingAccount: actingAccount!,
      setBalance: setBalance,
    });
    sleep(500);
    console.log("balanceOf");

    if (isCreatedFnRun) return;
    console.log("isCreatedFnRun");

    checkCreatedInfo({
      api: api,
      userId: actingAccount?.address!,
      setIsCreatedProfile: setIsCreatedProfile,
    });
    sleep(500);
    console.log("checkCreatedInfo");

    if (isCreatedProfile) return;
    console.log("isCreatedProfile");

    createProfile({ api: api, actingAccount: actingAccount! });
    sleep(500);
    console.log("checkCreatedInfo");

    setIsCreatedFnRun(true);
    console.log("setIsCreatedFnRun");

  }, [actingAccount]);

  return (
    <div className="flex justify-center items-center bg-gray-200 w-screen h-screen relative">
      <main className="items-center h-screen w-1/3 flex bg-white flex-col">
        <ProfileSettingModal
          isOpen={showSettingModal}
          afterOpenFn={setShowSettingModal}
          api={api}
          userId={actingAccount?.address}
          setImgUrl={setImgUrl}
          setName={setName}
          actingAccount={actingAccount}
        />
        <TopBar
          idList={accountList}
          imgUrl={imgUrl}
          setActingAccount={setActingAccount}
          balance={balance}
        />
        <ProfileSubTopBar
          imgUrl={imgUrl}
          name={name}
          followingList={followingList}
          followerList={followerList}
          isOpenModal={setShowSettingModal}
          setActingAccount={setActingAccount}
          idList={accountList}
          api={api!}
          actingAccount={actingAccount!}
          setIsCreatedFnRun={setIsCreatedFnRun}
        />
        <div className="flex-1 overflow-scroll">
          {individualPostList.map((post) => (
            <Post
              name={post.name}
              time={post.createdTime}
              description={post.description}
              num_of_likes={post.numOfLikes}
              user_img_url={imgUrl}
              post_img_url={post.imgUrl}
            />
          ))}
        </div>
        <div className="w-full">
          <BottomNavigation />
        </div>
      </main>
    </div>
  );
}