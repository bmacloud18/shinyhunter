import Link from "next/link";

export default function HuntTile({
    hunt
} : {
    hunt:any
}) {
    const active = hunt.end_date_display == null;
    return active ? (
        <div className="border-solid border-2 border-black flex flex-col items-center w-full gap-6 m-2">
            <div className="flex flex-col w-full">
                <span>
                    {hunt.nickname}
                </span>
                <span>
                    {hunt.hunt_time_display}
                </span>
                <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
            </div>
            <div className="flex flex-row justify-between w-full">
                <span className="justify-self-end self-end font-sans text-xl m-8">{hunt.count}</span>
                <div className="border-solid border-2 border-red mr-2 rounded-2xl p-5 bg-green hover:bg-buttonwhite">
                    <button className="">{"+"}</button>
                </div>
                <div className="border-solid border-2 border-red mr-2 rounded-2xl p-5 bg-green hover:bg-buttonwhite">
                    <button className="">{"-"}</button>
                </div>
            </div>
        </div>
    ): (
        <div className="border-solid border-2 border-black flex flex-col items-center w-full gap-6 m-2">
            <div className="flex flex-col w-full">
                <span>
                    {hunt.nickname}
                </span>
                <span>
                    {hunt.hunt_time_display}
                </span>
                <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
            </div>
            <div className="flex flex-row justify-between w-full">
                <span className="justify-self-end self-end font-sans text-xl m-8">{hunt.count}</span>
            </div>
            <div>
                <div>
                    <span>Game: {hunt.game}</span>
                    <span>Method: {hunt.game}</span>
                </div>
                <div>
                    <span>Start: {hunt.start_date_display}</span>
                    <span>End: {hunt.end_date_display}</span>
                </div>
            </div>
        </div>
    );
}