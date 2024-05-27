export default function HuntTile({
    hunt
} : {
    hunt:any
}) {
    const active = hunt.end_date_display == null;
    return (
        <div className="border-solid border-2 border-black flex flex-row w-full">
            <li>
                <span>
                    {hunt.nickname}
                </span>
                {active == true ? (
                    <span>
                        {hunt.start_date_display}
                    </span>
                ) : (
                    <span>
                        {hunt.end_date_display}
                    </span>
                )}
                <span>
                    {hunt.hunt_time_display}
                </span>
                <div className="flex flex-col gap-10">
                    <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
                    <span>{hunt.count}</span>
                </div>
            </li>
        </div>
    );
}