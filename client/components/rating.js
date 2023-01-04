import {Star, StarFill} from "react-bootstrap-icons";

export default ({book}) => {
    const {averageRating, ratingsCount} = book;

    if (!averageRating || !ratingsCount) {
        return <div>
            No ratings, yet.
        </div>
    }

    const stars = [
        <Star size={24}/>,
        <Star size={24}/>,
        <Star size={24}/>,
        <Star size={24}/>,
        <Star size={24}/>
    ]
    for (let i = 0; i < Math.round(averageRating); i++) {
        stars[i] = <StarFill size={24}/>
    }

    return <div className="text-danger d-flex flex-row gap-1">
        {stars.map((star) => star)}
    </div>
};