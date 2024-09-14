import "./listitem.scss";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

const ListItem = ({ imageUrl, title, rating }) => {
  return (
    <div className="listItem">
      <img src={imageUrl} alt="Movie Poster" />
      <div className="itemInfo">
        <div className="icons">
          <span className="iconsInfo font-weight-bold">{title}</span>
          <StarBorderOutlinedIcon />
          <span className="iconsInfo">{rating}/5</span>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
