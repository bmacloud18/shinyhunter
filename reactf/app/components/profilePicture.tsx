import Image from "next/image";
// SVG of the loading icon.
export default function ProfilePicture({
    src,
    id,
    tail,
    dimensions
}: {
    src:any;
    id:string;
    tail:number
    dimensions:number;
}) {
    const cn = `h-${tail} w-${tail} fill-green pfp`
    return (
        <Image src={src} alt="Profile Picture" className={cn} data-user-id={id} height={dimensions} width={dimensions} unoptimized/>
    );
}