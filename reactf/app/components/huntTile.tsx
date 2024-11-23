import Link from "next/link";
import Hunt from "@/app/interfaces/hunt";

export default function HuntTile({
    hunt
} : {
    hunt:Hunt
}) {
    const active = hunt.end_date_display == null;
    return (
        <Link className="w-fit self-center" href={`/shinyhunter/hunt/${hunt.id}`}>
            <div className="flex self-center border-solid border-2 border-black p-2 rounded-2xl lg:w-[20rem] md:w-[16rem] sm:w-[8rem] flex flex-col gap-6">
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
                    <img src={hunt.sprite.toString()} alt="pkm sprite" className="md:h-24 md:w-24 fill-green sm:h-12 sm:w-12" />
                    <span className="justify-self-end self-end text-xl m-8">{hunt.count}</span>
                </div>
            </div>
        </Link>
    );
}