"use client"

import MintModal from "../modals/mintModal"

export default function Mint() {



    return (
        <>
        <MintModal
            visible={true}
        />
          <div
            onClick={() => alert("hello")}
            className="w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
        >
            Mint Now
        </div>
        </>
      
    )

}
