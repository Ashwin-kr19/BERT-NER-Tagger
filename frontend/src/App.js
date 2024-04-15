import { TokenAnnotator } from "react-text-annotate";
import { useState, React } from "react";
import {
    Tooltip,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Container,
    AppBar,
    Typography,
    Toolbar,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
const TAG_COLORS = {
    org: "#00ffa2",
    per: "#84d2ff",
    geo: "#ffc282",
};

function App() {
    const [value, setValue] = useState("");
    const [tags, setTags] = useState([]);

    async function getTags() {
        var _tags = await fetch(
            `http://localhost:8000/api/ner-tags?string=${value}`
        ).then((res) => res.json());
        console.log(_tags);
        setTags(_tags);
    }
    return (
        <div
            className="App"
            style={{
                height: "100vh",
            }}
        >
            <AppBar position="sticky">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Named Entity Recognition
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "70%",
                    justifyContent: {
                        sm: "start",
                        xs: "start",
                        md: "center",
                    },
                    alignItems: "center",
                    marginTop: {
                        sm: "40px",
                        xs: "40px",
                    },
                    width: {
                        xs: "90%",
                        sm: "80%",
                        md: "75%",
                    },
                }}
            >
                <OutlinedInput
                    variant="outlined"
                    type="text"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setTags([]);
                    }}
                    style={{
                        width: "100%",
                        fontSize: "16px",
                        borderRadius: "25px",
                    }}
                    placeholder="Type something here to annotate it..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            getTags();
                        }
                    }}
                    endAdornment={
                        <InputAdornment>
                            <IconButton
                                onClick={() => {
                                    getTags();
                                }}
                                color="primary"
                            >
                                <SearchRoundedIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setValue("");
                                    setTags([]);
                                }}
                                color="error"
                            >
                                <RefreshRoundedIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "24px",
                    }}
                >
                    <TokenAnnotator
                        tokens={value.split(" ")}
                        value={tags}
                        onChange={(e) => console.log(e)}
                        renderMark={(tag, i) => {
                            return (
                                <Tooltip
                                    title={
                                        <h2>
                                            Score: {tag.score.toFixed(5) * 100}%
                                        </h2>
                                    }
                                >
                                    <mark
                                        key={i}
                                        style={{
                                            backgroundColor:
                                                TAG_COLORS[tag.tag],
                                            padding: "0 0.3em",
                                            borderRadius: "0.3em",
                                            lineHeight: "1.5",
                                            color: "black",
                                            fontWeight: "bold",
                                            display: "inline-block",
                                            marginRight: "5px",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        {tag.content}{" "}
                                        <span
                                            style={{
                                                boxSizing: "border-box",
                                                content: "attr(data-entity)",
                                                fontSize: "0.75em",
                                                lineHeight: "0.8",
                                                padding: ".35em .35em",
                                                borderRadius: ".35em",
                                                textTransform: "uppercase",
                                                display: "inline-block",
                                                verticalAlign: "middle",
                                                margin: "0 0 .15rem .5rem",
                                                background: "#fff",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {" "}
                                            {tag.tag}
                                        </span>
                                    </mark>
                                </Tooltip>
                            );
                        }}
                    />
                </div>
            </Container>
        </div>
    );
}

export default App;
