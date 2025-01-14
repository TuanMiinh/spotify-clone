import React, { Fragment } from 'react'
import FowardIcon from '../Component/FowardIcon/FowardIcon'
import Account from '../Component/Account/Account'
import './BodySearch.css'
import SearchIcon from '@material-ui/icons/Search';
import MostFavourite from '../Component/MostFavourite/MostFavourite';
import ListFindAll from '../Component/ListFindAll/ListFindAll';
import { useState,useRef,useEffect } from 'react';
import { useSelector } from 'react-redux';
import SongSearch from '../Component/SongSearch/SongSearch';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { setState, setCurrentSong , addPlayList , setSongIndex } from '../Component/HoldSong/songSlice';
import { useDispatch } from 'react-redux';
import HoldArtist from '../Component/HoldArtist/HoldArtist';
import a from './image/245772355_4703218706396895_2645923233280716365_nn.jpg'
import b from './image/251809088_1633056763752680_4471930787292251240_n.jpg'



export default function BodySearch() {

    const [searchTerm,setSearchTerm] = useState('');
    const typingTimeOutRef = useRef(null)
    const [songList, setSongList] = useState([]);
    const token = useSelector(state => state.playLists).token
    const songID = useSelector(state => state.playLists).songID
    const isPlay = useSelector(state => state.playLists).isPlay
    const handleSearchTermChangle = (e) =>{
        setSearchTerm(e.target.value);
            
        if(typingTimeOutRef.current){
            clearTimeout(typingTimeOutRef.current);
        };

        typingTimeOutRef.current = setTimeout(()=>{
            setSearchTerm(e.target.value);
            fetch('http://localhost:8080/api/song/search/'+searchTerm,{
                headers:{
                    'Authorization':token
                }
            })
                .then(respone => respone.json())
                .then(data => {
                    setSongList(data)
                });
        },300)

    }
    const getResult = () =>{
        let i
        const result = []
        if(songList.length>=1){
            for(i = 0 ; i <= songList.length - 1 ; i++){
                if(i == 4) break;
                result.push(songList[i])
            }
        }
        
        return result
    }
    
    const dispatch = useDispatch()

    const handleClick = ()=>{

        const action1 = setState({
            type:'search',
            songID:songList[0].song_id
        })

        dispatch(action1);

        const action2 = setCurrentSong({
            current:0,
            songID:songList[0].song_id
        });
        dispatch(action2);


        const action3 = addPlayList({
            listSong : [songList[0]]
            
        })
        

            dispatch(action3)
        
        
        const action4 = setSongIndex({
            song_id : songList[0].song_id
        })
        
        dispatch(action4)
    }
    
    const handlePause = () => {
        const action1 = setState({
            type:'search',
            songID:songList[0].song_id
        })

        dispatch(action1);
    }
    return (
        <div className='body'>
            <div className = 'body-bar'>
                <div className = 'body-bar__first'>
                    <FowardIcon/>
                    <div className='body-bar__find'>
                        <SearchIcon/>
                        <input placeholder='Nghệ sĩ, bài hát hoặc podcast' value={searchTerm} onChange={handleSearchTermChangle}/>
                    </div>
                    
                </div>
                
                <Account/>
            </div>

        {songList.length==0?(
                <div className='bodysearch-main'>
                    <MostFavourite/>
                    <ListFindAll/>
                    <ListFindAll/>
                    <ListFindAll/>
                    <ListFindAll/>
                    <ListFindAll/>
                    <ListFindAll/>
                    <ListFindAll/>
                </div> 
            ):(
                <Fragment>
                    <div className='bodysearch-result'>
                        <div className='bodysearch-result__topshow'>
                            <p>Kết quả hàng đầu</p>
                            <div>
                                <img src={songList[0].song_image}></img>
                                
                                <p>{songList[0].song_name}</p>
                                <p>{songList[0].artist[0].artist_name}</p>
                                <div>
                                    <PlayCircleIcon sx={{ color: 'green' , fontSize:70 ,display: !isPlay?'block':'none'}} onClick={handleClick}/>
                                    <PauseCircleIcon sx={{ color: 'green' , fontSize:70,display: isPlay&&songID==songList[0].song_id?'block':'none'}} onClick={handlePause}/>
                                </div>
                                
                                {/* <div>BÀI HÁT</div> */}
                            </div>
                        </div>
                        <div className='bodysearch-result__listshow'>
                            <p>Kết quả</p>
                            <div>
                            {   
                                getResult().map((song,i) =>{
                                    
                                    return <SongSearch song = {song} />
                                })
                            }
                            </div>
                            
                        
                        </div>
                    </div> 
                    
                    <div className='bodysearch-artist'>
                        <p>Nghệ sĩ</p>
                        <div>
                            <HoldArtist image = {a} name = 'Đàm Vĩnh Hưng'/>
                            <HoldArtist image = {b} name = 'Dot Blastrizer77'/>
                            <HoldArtist image = 'https://cdns-images.dzcdn.net/images/artist/3066767b915a02a29660cd647243859c/264x264.jpg' name = 'G-DRAGON'/>
                            <HoldArtist image = 'https://salt.tikicdn.com/cache/525x525/ts/product/41/12/bf/f0e06d4059dd3d7f5e89a1f7d21893c1.jpg' name = 'ROSÉ'/>
                            <HoldArtist image = 'https://i.scdn.co/image/ab6761610000f178c48716f91b7bf3016f5b6fbe' name = 'Sơn Tùng M-TP'/>
                            <HoldArtist image = 'https://i.scdn.co/image/ab6761610000e5ebd2e6780f1a921fb8bb1634a2' name = 'Jack - J97'/>
                        </div>
                    </div>
                </Fragment>
                
                 
            )
        }
            


            
        </div>
    )
}
