import Link from "next/link";

export default function HuntTile({
    hunt
} : {
    hunt:any
}) {
    const active = hunt.end_date_display == null;
    return (
        <Link href={`/shinyhunter/hunt/${hunt.id}`}>
            <div className="border-solid border-2 border-black p-2 rounded-2xl flex flex-col gap-6 m-2">
                <div className="flex flex-col">
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
                </div>
                <div className="flex flex-row justify-between w-full">
                    <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
                    <span className="justify-self-end self-end font-sans text-xl m-8">{hunt.count}</span>
                </div>
            </div>
        </Link>
    );
}