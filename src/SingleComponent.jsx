
import React, { useContext } from 'react';
import "./index.css";
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'
import InputBox from './InputBox';
import { useSelector } from 'react-redux';
import LoadingComponent from './Loading';

function SingleComponent() {

    const answer = useSelector((state) => state.answer.value);
    const isLoading = useSelector((state) => state.answer.isLoading);

    return (
        <>
            <LoadingComponent isLoading={isLoading} />
            <Markdown
                remarkPlugins={[remarkGfm]}
                className="bg-orange-100 mt-1 w-full resize-none md:text-1xl h-auto min-h-250 pl-2 pt-2 rounded-lg outline-none border-blue-200 align-top shadow-sm overflow-auto  "
                children={answer}
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
             



            <InputBox ></InputBox>


        </>
    );
}

export default SingleComponent;
