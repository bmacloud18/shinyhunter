// SVG of the loading icon.
export default function ProfilePicture({
    source,
}: {
    source:any;
}) {
    return (
      <img src={source} alt="Loading Icon" className="h-24 w-24 fill-green" />
    );
}