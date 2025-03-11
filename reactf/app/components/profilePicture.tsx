import Image from "next/image";
// SVG of the loading icon.
export default function ProfilePicture({
    source,
}: {
    source:any;
}) {
    return (
      <Image src={"https://robohash.org/XkkpnOiQy8u6cA.png?size=64x64&set=set1&bgset=any"} alt="Profile Picture" className="h-24 w-24 fill-green" height="96" width="96" unoptimized/>
    );
}