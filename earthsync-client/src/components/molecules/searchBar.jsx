import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

// search bar component with history feature
export default function SearchBar({ placeholder = "Pesquisar eventos..." }) {
const [value, setValue] = useState("");
const [history, setHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const inputRef = useRef();

// fetch history from backend on input focus
const handleFocus = async () => {
try {
const res = await axios.get("http://localhost:5000/api/history");
setHistory(res.data);
setShowHistory(true);
} catch (err) {
console.error("Erro ao carregar histórico:", err);
}
};

// update input value on change
const handleInputChange = (e) => {
setValue(e.target.value);
};

// handle enter key to save search in history
const handleKeyDown = async (e) => {
if (e.key === "Enter" && value.trim()) {
try {
await axios.post("http://localhost:5000/api/history", { query: value });
console.log("Histórico salvo:", value);
} catch (err) {
console.error("Erro ao salvar histórico:", err);
}
setShowHistory(false);
}
};

// select a previous search from history
const handleSelectHistory = (query) => {
setValue(query);
setShowHistory(false);
};

 // close history dropdown when clicking outside
useEffect(() => {
const handleClickOutside = (event) => {
if (inputRef.current && !inputRef.current.contains(event.target)) {
setShowHistory(false);
}
};
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

return (
<div className="relative w-full max-w-md" ref={inputRef}>
<Input
type="text"
placeholder={placeholder}
value={value}
onChange={handleInputChange}
onFocus={handleFocus}
onKeyDown={handleKeyDown}
className="pl-10 pr-10"
autoComplete="off"
/>

{showHistory && history.length > 0 && (
<ul className="absolute left-0 right-0 bg-white shadow-md rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
{history.map((item) => (
<li
key={item.id}
className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
onClick={() => handleSelectHistory(item.query)}
>
{item.query}
</li>
))}
</ul>
)}
</div>
);
}
