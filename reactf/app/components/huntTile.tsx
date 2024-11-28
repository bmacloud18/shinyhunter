import Link from "next/link";
import Hunt from "@/app/interfaces/hunt";

export default function HuntTile({
    hunt
} : {
    hunt:Hunt
}) {
    const active = hunt.end_date_display == null;
    return (
        <Link className="w-fit self-center h-[10rem]" href={`/shinyhunter/hunt/${hunt.id}`}>
            <div className="flex self-center justify-between border-solid border-2 border-black p-2 rounded-2xl lg:w-[18rem] md:w-[14rem] sm:w-[8rem] h-[10rem] flex flex-col">
                <div className="flex flex-col">
                    <span className="sm:max-md:text-sm">
                        {hunt.nickname}
                    </span>
                    {active == true ? (
                        <span className="sm:max-md:text-sm">
                            {hunt.start_date_display}
                        </span>
                    ) : (
                        <span className="sm:max-md:text-sm">
                            {hunt.end_date_display}
                        </span>
                    )}
                    <span className="sm:max-md:text-sm">
                        {hunt.hunt_time_display}
                    </span>
                </div>
                <div className="flex flex-row justify-between w-full">
                    <img src={hunt.sprite.toString()} alt="pkm sprite" className="sm:h-[3rem] sm:w-[3rem] lg:w-[4rem] lg:h-[4rem] fill-green" />
                    <span className="self-center text-xl sm:max-md:text-base h-full ml-2">{hunt.count}</span>
                </div>
            </div>
        </Link>
    );
}