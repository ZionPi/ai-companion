import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'

function ListItem({ item }) {

    function getColorByRole() {
        switch(item.role) {
            case "user":
                return `-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-green-600 px-3 py-1.5 text-white`;
            default:
                return `-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-yellow-600 px-3 py-1.5 text-white`;
        }
         
    }

    const convertToShanghaiTime = (utcTimeString) => {
        // 创建一个新的Date对象，它将UTC时间字符串解析为UTC时间
        const date = new Date(utcTimeString);

        // 使用toLocaleString将UTC时间转换为上海时间
        // 'zh-CN' 是用于中文显示的locale
        // timeZone 设置为 'Asia/Shanghai' 以获取上海时间
        return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    };

    return (
        <article className="rounded-xl border-2 border-gray-100 bg-white">
            <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">
                <a href="#" className="block shrink-0">
                    <img
                        alt={item.name}
                        src={item.imgUrl}
                        className="size-14 rounded-lg object-cover"
                    />
                </a>

                <div>
                    <h3 className="font-medium sm:text-lg">
                        <a href="#" className="hover:underline"> {item.name} </a>
                    </h3>

                    {/* <p className="line-clamp-2 text-2xl text-gray-700">
                        {item.desc}
                    </p> */}


                     <Markdown
                            remarkPlugins={[remarkGfm]}
                            className="text-sm md:text-lg lg:text-xl text-gray-800 mt-1 w-full resize-none md:text-1xl h-auto min-h-2 outline-none border-blue-200 align-top shadow-sm overflow-auto  "
                            children={item.desc}
                            components={{
                                code(props) {
                                    const { children, className, node, ...rest } = props
                                    const match = /language-(\w+)/.exec(className || '')
                                    return match ? (
                                        <div style={{ position: 'relative' }}>
                                            <SyntaxHighlighter
                                                {...rest}
                                                PreTag="div"
                                                children={String(children).replace(/\n$/, '')}
                                                language={match[1]}
                                                style={dark}
                                            />
                                            <CopyToClipboard text={String(children).replace(/\n$/, '')}>
                                                <button style={{ position: 'absolute', right: '10px', top: '5px', color: '#ffffff' }}>
                                                    Copy
                                                </button>
                                            </CopyToClipboard>
                                        </div>

                                    ) : (
                                        <code {...rest} className={className}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        />

                    <div className="mt-2 sm:flex sm:items-center sm:gap-2">
                        {/* <div className="flex items-center gap-1 text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                />
                            </svg>

                            <p className="text-xs">14 comments</p>
                        </div> */}

                        {/* <span className="hidden sm:block" aria-hidden="true">&middot;</span> */}

                        <p className="hidden sm:block sm:text-xs sm:text-gray-500 mt-3">
                            发布于@
                            <a href="#" className="font-medium underline hover:text-gray-700"> {convertToShanghaiTime(item.timestamp)} </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <strong
                    className={getColorByRole()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                    </svg>

                    <span className="text-[10px] font-medium sm:text-xs">{item.role}</span>
                </strong>
            </div>
        </article>
    );

}
export default ListItem;