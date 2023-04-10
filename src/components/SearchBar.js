
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


export default function SearchBar(props) {
    const styles = {
        "search": {
            alignItems: "center",
            justifyContent: "left", 
            paddingLeft: "20px",
            paddingRight: "20px",
            marginTop: "10px",
            marginBottom: "10px",
            display: "grid",
            gridAutoFlow: "column",
            gridColumnGap: "10px",
        },
        
        "search__box": { 
            width: "330px",
            height: "30px",
            borderRadius: "10px",
            borderWidth: "0px",
            paddingLeft: "10px",
            fontSize: "14px",
        }
    }

    function handleFocus(e) {
        e.target.style.outlineColor = "#04c9a8";
    }

    return (
        <div style={styles.search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="#fff" size="lg"/>
            <input style={styles.search__box} type="text" placeholder={`Search ${props.type}`} onFocus={e => handleFocus(e)} onChange={e => props.setSearchKey(e.target.value)}/>
        </div>
    )
}