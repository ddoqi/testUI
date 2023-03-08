import type { NextPage } from "next";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

const FCItems: NextPage = () => {
    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-95"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="menu-wh w-[160px]">
                <ul className="flex flex-col">
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/밥&도시락&면`}
                                className="menu-items"
                            >
                                밥/도시락/면
                            </Link>
                        </li>
                    </Menu.Item>
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/국&탕&찌개`}
                                className="menu-items"
                            >
                                국/탕/찌개
                            </Link>
                        </li>
                    </Menu.Item>
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/구이&볶음&찜`}
                                className="menu-items"
                            >
                                구이/볶음/찜
                            </Link>
                        </li>
                    </Menu.Item>
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/튀김류`}
                                className="menu-items"
                            >
                                튀김류
                            </Link>
                        </li>
                    </Menu.Item>
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/베이커리&디저트`}
                                className="menu-items"
                            >
                                베이커리/디저트
                            </Link>
                        </li>
                    </Menu.Item>
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/음료&주류`}
                                className="menu-items"
                            >
                                음료/주류
                            </Link>
                        </li>
                    </Menu.Item>
                    <Menu.Item>
                        <li>
                            <Link
                                href={`/search/식단&건강관리`}
                                className="menu-items pb-6"
                            >
                                식단/건강관리
                            </Link>
                        </li>
                    </Menu.Item>
                </ul>
            </Menu.Items>
        </Transition>
    );
};

export default FCItems;
