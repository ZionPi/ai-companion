import { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import AvatarAndCaption from "./AvatarAndCaption";

//{ onLinkClick }
function NavigatorComponent() {
    
    const [activePage, setActivePage] = useState("conversation");

    const handleHighlight = (page) => {
        setActivePage(page);
    }

 
    function getLinkClass(linkName) {

        switch (linkName) {
            case "setting":
                return `t group relative flex justify-center rounded  px-2 py-1.5 hover:bg-gray-50 hover:text-gray-700 ${activePage === linkName ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`;
            case "conversation":
                return `group relative flex justify-center rounded px-2 py-1.5    hover:bg-gray-50 hover:text-gray-700 ${activePage === linkName ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`;
            case "history":
                return `group relative flex justify-center rounded px-2 py-1.5 hover:bg-gray-50 hover:text-gray-700 ${activePage === linkName ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`;
            case "randomize":
                return `group relative flex justify-center rounded px-2 py-1.5  hover:bg-gray-50 hover:text-gray-700 ${activePage === linkName ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`;
            case "account":
                return `group relative flex justify-center rounded px-2 py-1.5  hover:bg-gray-50 hover:text-gray-700 ${activePage === linkName ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`;
            case "logout":
                return `group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm  hover:bg-gray-50 hover:text-gray-700 ${activePage === linkName ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`;
            default:
                break;
        }

    }


    return (<div className="max-sm:hidden flex h-screen w-16  flex-col justify-between border-e bg-white">
        <div>

           <AvatarAndCaption></AvatarAndCaption>

            <div className="border-t border-gray-100">
                <div className="px-2">
                    <div className="py-4">
                        <Link
                            to="/conversation"
                            className={getLinkClass('conversation')}
                        onClick={() => { handleHighlight('conversation'); }}
                        >
                            <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>

                            <span className="z-[5] invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                                对话
                            </span>
                        </Link>
                    </div>

                    <ul className="space-y-1 border-t border-gray-100 pt-4">

                        <li>
                             <Link to="/history"
                                href="#"
                                className={getLinkClass('history')}
                                onClick={() => { handleHighlight('history');}}
                            >
                                <svg className="w-5 h-5"  fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>

                                <span
                                    className="z-[5] invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                                >
                                    历史记录
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                               to = "/randomize"
                                href="#"
                                className={getLinkClass('randomize')}
                                onClick={() => { handleHighlight('randomize');}}
                            >
                                <svg className="w-5 h-5"  fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                                </svg>

                                <span
                                    className="z-[5] invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                                >
                                    随机
                                </span>
                            </Link>
                        </li>

                        <li className="hidden">
                            <Link
                               to="/account"
                                href="#"
                                className={getLinkClass('account')}
                                onClick={() => { handleHighlight('account');  }}
                            >
                                <svg className="w-5 h-5"  fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                </svg>

                                <span
                                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                                >
                                    账户
                                </span>
                            </Link>
                        </li>

                        <li>



                            <Link
                                to= "/setting"
                                href="#"
                                className={getLinkClass('setting')}
                                onClick={() => { handleHighlight('setting');  }}
                            >


                                <svg className="w-5 h-5"  fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                </svg>

                                <span
                                    className=" z-[5] invisible  absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                                >
                                    设置
                                </span>
                            </Link>


                        </li>


                    </ul>
                </div>
            </div>
        </div>

        <div className="sticky w-[50px] inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">

            <div
                // type="submit"
                className={getLinkClass('logout')}
            // onClick={() => { handleHighlight('logout');  }}
            >

                <SignOutButton>
                    <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                </SignOutButton>
                <span
                    className="z-[9999] invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >

                    退出
                </span>

            </div>
        </div>
    </div>);
}

export default NavigatorComponent;