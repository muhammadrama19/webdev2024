import "./listitem.scss";
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

const listitem = () => {
  return (
    <div className="listItem">
        <img src="https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg" alt="" />
        <div className="itemInfo">
            <div className="icons">
                <RemoveRedEyeOutlinedIcon />
                <span className="iconsInfo"> 10.3K</span>
                <StarBorderOutlinedIcon />
                <span className="iconsInfo">3.5/5</span>
            </div>
        </div>
    </div>
  )
}

export default listitem
