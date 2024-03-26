function SettingComponent() {
    return (
        <div className="w-full">
            <div class="flex items-center justify-center p-12">

                <div class="mx-auto w-full max-w-[550px]">
                    <form action="https://formbold.com/s/FORM_ID" method="POST">
                        <div class="-mx-3 flex flex-wrap">
                            <div class="w-full px-3 sm:w-3/4">
                                <div class="mb-5">
                                    <label
                                        for="fName"
                                        class="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        服务器IP
                                    </label>
                                    <input
                                        type="text"
                                        name="fName"
                                        id="fName"
                                        placeholder="127.0.0.1"
                                        class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                            <div class="w-full px-3 sm:w-1/4">
                                <div class="mb-5">
                                    <label
                                        for="lName"
                                        class="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        端口号
                                    </label>
                                    <input
                                        type="text"
                                        name="lName"
                                        id="lName"
                                        placeholder="7077"
                                        class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                        </div>


                        <div class="mb-5">
                            <label class="mb-3 block text-base font-medium text-[#07074D]">
                                默认交互模式
                            </label>
                            <div class="flex items-center space-x-6">
                                <div class="flex items-center">
                                    <input
                                        type="radio"
                                        name="radio1"
                                        id="radioButton1"
                                        class="h-5 w-5"
                                    />
                                    <label
                                        for="radioButton1"
                                        class="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        搜寻
                                    </label>
                                </div>
                                <div class="flex items-center">
                                    <input
                                        type="radio"
                                        name="radio1"
                                        id="radioButton2"
                                        class="h-5 w-5"
                                    />
                                    <label
                                        for="radioButton2"
                                        class="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        聊天
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label
                                for="guest"
                                class="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                预警阈值
                            </label>
                            <input
                                type="number"
                                name="guest"
                                id="guest"
                                placeholder="90"
                                min="0"
                                class="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>

                        <div class="-mx-3 flex flex-wrap">
                            <div class="w-full px-3 sm:w-1/2">
                                <div class="mb-5">
                                    <label
                                        for="date"
                                        class="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                            <div class="w-full px-3 sm:w-1/2">
                                <div class="mb-5">
                                    <label
                                        for="time"
                                        class="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        id="time"
                                        class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                        </div>

                        

                        <div className="flex justify-end ">
                            <button
                                class="hover:shadow-form rounded-md bg-[#c6bfa1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                            >
                                保存
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default SettingComponent;