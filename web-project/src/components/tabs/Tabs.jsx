import React, { useState, useEffect, useRef } from "react";
import {
    FaHome,
    FaUniversity,
    FaPhone,
    FaFileInvoice,
    FaShoppingCart,
    FaChartBar,
    FaEnvelope,
    FaTools,
    FaQuestionCircle,
    FaBoxes,
    FaListAlt,
    FaStore,
    FaReceipt,
    FaWarehouse,
} from "react-icons/fa";
import style from "./Tabs.module.css";
import { useNavigate } from "react-router-dom";

const initialTabs = [
    { id: 1, order: 1, name: "Dashboard", url: "/dashboard" },
    { id: 2, order: 2, name: "Banking", url: "/banking" },
    { id: 3, order: 3, name: "Telephony", url: "/telephony" },
    { id: 4, order: 4, name: "Accounting", url: "/accounting" },
    { id: 5, order: 5, name: "Sales", url: "/sales" },
    { id: 6, order: 6, name: "Statistics", url: "/statistics" },
    { id: 7, order: 7, name: "Mail", url: "/mail" },
    { id: 8, order: 8, name: "Administration", url: "/administration" },
    { id: 9, order: 9, name: "Help", url: "/help" },
    { id: 10, order: 10, name: "Inventory", url: "/inventory" },
    { id: 11, order: 11, name: "Stock", url: "/stock" },
    { id: 12, order: 12, name: "Selection Lists", url: "/selection-lists" },
    { id: 13, order: 13, name: "Purchasing", url: "/purchasing" },
    { id: 14, order: 14, name: "Invoices", url: "/invoices" },
    { id: 15, order: 15, name: "Warehouse", url: "/warehouse" },
];

const iconsMap = {
    1: <FaHome />,
    2: <FaUniversity />,
    3: <FaPhone />,
    4: <FaFileInvoice />,
    5: <FaShoppingCart />,
    6: <FaChartBar />,
    7: <FaEnvelope />,
    8: <FaTools />,
    9: <FaQuestionCircle />,
    10: <FaBoxes />,
    11: <FaWarehouse />,
    12: <FaListAlt />,
    13: <FaStore />,
    14: <FaReceipt />,
    15: <FaWarehouse />,
};

const Tabs = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [currentCard, setCurrentCard] = useState(null);
    const [visibleTabs, setVisibleTabs] = useState([]);
    const [dropdownTabs, setDropdownTabs] = useState([]);

    const [urlList, setUrlList] = useState(() => {
        const saved = localStorage.getItem("tabsOrder");
        if (saved) {
            return JSON.parse(saved).map(tab => ({ ...tab, icon: iconsMap[tab.id] }));
        }
        return initialTabs.map(tab => ({ ...tab, icon: iconsMap[tab.id], pinned: false }));
    });

    const saveToStorage = (tabs) => {
        localStorage.setItem(
            "tabsOrder",
            JSON.stringify(
                tabs.map(({ id, order, name, url, pinned }) => ({ id, order, name, url, pinned }))
            )
        );
    };
    //add new

    const dragStartHandler = (e, value) => setCurrentCard(value);
    const dragLeaveHandler = () => {};
    const dragEndHandler = (e) => (e.target.style.background = "white");
    const dragOverHandler = (e) => {
        e.preventDefault();
        e.target.style.background = "lightgray";
    };
    const dropHandler = (e, value) => {
        e.preventDefault();
        setUrlList((prev) => {
            const newList = prev.map((c) => {
                if (c.id === value.id) return { ...c, order: currentCard.order };
                if (c.id === currentCard.id) return { ...c, order: value.order };
                return c;
            });
            saveToStorage(newList);
            return newList;
        });
        e.target.style.background = "white";
    };

    const sortCards = (a, b) => (a.order > b.order ? 1 : -1);

    const togglePin = (id) => {
        setUrlList(prev => {
            const newList = prev.map(tab => tab.id === id ? { ...tab, pinned: !tab.pinned } : tab);
            saveToStorage(newList);
            return newList;
        });
    };

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            let usedWidth = 0;
            const visible = [];
            const dropdown = [];
            urlList
                .sort(sortCards)
                .forEach((tab) => {
                    const estimatedWidth = 120;
                    if (tab.pinned || usedWidth + estimatedWidth <= containerWidth - 50) {
                        visible.push(tab);
                        usedWidth += estimatedWidth;
                    } else {
                        dropdown.push(tab);
                    }
                });
            setVisibleTabs(visible);
            setDropdownTabs(dropdown);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [urlList]);

    return (
        <div className={style.table} ref={containerRef}>
            {visibleTabs.map((value) => (
                <div
                    key={value.id}
                    className={style.tab}
                    draggable
                    onDragStart={(e) => dragStartHandler(e, value)}
                    onDragLeave={dragLeaveHandler}
                    onDragEnd={dragEndHandler}
                    onDragOver={dragOverHandler}
                    onDrop={(e) => dropHandler(e, value)}
                    onClick={() => navigate(value.url)}
                >
                    {value.icon} {value.name}{" "}
                    <button onClick={(e) => { e.stopPropagation(); togglePin(value.id); }} className={style.pinBtn}>
                        {value.pinned ? "📌" : "📍"}
                    </button>
                </div>
            ))}
            {dropdownTabs.length > 0 && (
                <div className={style.dropdown}>
                    <button className={style.dropdownBtn}>More ▼</button>
                    <div className={style.dropdownContent}>
                        {dropdownTabs.map((value) => (
                            <div
                                key={value.id}
                                className={style.tab}
                                draggable
                                onDragStart={(e) => dragStartHandler(e, value)}
                                onDragLeave={dragLeaveHandler}
                                onDragEnd={dragEndHandler}
                                onDragOver={dragOverHandler}
                                onDrop={(e) => dropHandler(e, value)}
                                onClick={() => navigate(value.url)}
                            >
                                {value.icon} {value.name}{" "}
                                <button onClick={(e) => { e.stopPropagation(); togglePin(value.id); }} className={style.pinBtn}>
                                    {value.pinned ? "📌" : "📍"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tabs;
