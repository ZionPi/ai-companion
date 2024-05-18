import React from 'react';
import { useSelector } from 'react-redux';
import { display, generate } from "facesjs";
import { useEffect, useMemo } from "react";
import { useUser } from '@clerk/clerk-react';

const AvatarAndCaption = () => {

    const { isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn) {
            const face = generate();
            display("avatar", face);
        }
    }, [isSignedIn]); // Run the effect only when isSignedIn changes

    const configData = useSelector(state => state.config.config);

    const change_avatar = () => {
        const face = generate();
        display("avatar", face);
    };

    const userNameToDisplay = useMemo(() => {
        return isSignedIn ? configData.user_name : "未登录";
    }, [isSignedIn, configData.user_name]);

    return (
        <div className="flex flex-col items-center">
            <div className='justify-center'>
                {isSignedIn && (<div
                    id="avatar"
                    onClick={isSignedIn ? change_avatar : undefined} // Only allow clicks when signed in
                    className={` mt-1 cursor-pointer size-14 ml-4`} // Conditionally apply gray background
                >
                </div>)}
                {!isSignedIn && (<div
                    onClick={isSignedIn ? change_avatar : undefined} // Only allow clicks when signed in
                    className={` mt-1 cursor-pointer bg-gray-400 size-12 ml-0 `} // Conditionally apply gray background
                ></div>)}

            </div>

            <div className="text-center">
                <span className="text-xs text-gray-600 mt-2">
                    {userNameToDisplay}
                </span>
            </div>
        </div>
    );
};

export default AvatarAndCaption;