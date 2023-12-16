import { useState } from "react";
import "./style.scss";

const SwitchTabs = ({ data, onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(0);       // isme tab ka index put kiya jayega dynamically... kyuki ye tab select hone se api fetching ka kaam bhi karega. selectedTab represents the currently selected tab, and initially set to 0.
  const [left, setLeft] = useState(0);                     // left state ka use positioning ke liye kiya ja ra hai ki data array me available koi bhi key left se kitna doori per hai, ise basically 100 se multiply karke set kiya jayega kyuki span ke andar har ek tab ki width 100px hai. isiliye 2nd span ki bhi width 100px hai....

  const activeTab = (tab, index) => {                     // activeTab function tab call hoti hai jab aap kisi tab par click karte hain.
    setLeft(index * 100);                                 // Yeh setLeft(index * 100) line current selectedTab ke index se multiply karke usi current selected tab ke position(index no.) ko set karta hai. Isse tab ka position left state mein set ho jata hai. Har tab ka width 100 pixels hai, isliye har ek tab ke position ko pixels mein represent karne ke liye 100 se multiply kiya jata hai. Agar aap 100 se multiply nahi karte, toh tab ki position sahi se set nahi hogi aur visual indication sahi tarah se nahi dikhegi. Is tareeke se, har ek tab ko 100 pixels ka ek block milta hai, jisse unki positioning sahi se ho sake.
    setTimeout(() => {
      setSelectedTab(index);                                // current selected tab ka index update karna jaruri hai...
    }, 300);

    onTabChange(tab);
  };


  return (
    <div className="switchingTabs">
      <div className="tabItems">
        {data.map((tab, index) => (
          <span
            key={index}
            className={`tabItem ${selectedTab === index ? "active" : ""}`}
            onClick={() => activeTab(tab, index)}
          >
            {tab}
          </span>
        ))}
        <span className="movingBg" style={{ left: left }} />                {/* Jab aap kisi tab ko click karte hain, activeTab function call hota hai, jisme setLeft(index * 100) line hai. Yeh line left state ko set karti hai, jiska effect movingBg element par hota hai. setLeft(index * 100) karke left state mein jo bhi value set hoti hai, wo value movingBg element ke left property mein apply hoti hai. Iske baad, transition property ke through, yeh left property smoothly (cubic-bezier function ke hisab se) change hoti hai, jisse movingBg visually tab ke neeche move karta hai. Jab aap kisi aur tab ko select karte hain, tab activeTab function phir se call hota hai, jisme setLeft(index * 100) hota hai, aur fir se left state change hota hai, jo ki movingBg ke movement ko trigger karta hai. */}     {/* iss span ka kaam hai visual indication provide karna ki kaunsa tab selected hai. Yeh tab ke neeche horizontally move karta hai. aur isme styling ke through se hi ye vidual indication provide karata hai. */}
      </div>
    </div>
  );
};

export default SwitchTabs;
