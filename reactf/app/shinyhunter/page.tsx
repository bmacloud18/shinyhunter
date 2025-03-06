"use client";
import React, { useState, useEffect } from "react";

import BigButton from "@/app/components/bigButton";
import HuntTile from "@/app/components/huntTile";
import TileGrid from "@/app/components/tileGrid";
import Grid from "@/app/components/fullGrid";
import ProfileHeader from "@/app/components/profileHeader";

import api from "@/app/APIclient";

import User from "@/app/interfaces/user";
import Hunt from "@/app/interfaces/hunt";
import sample from "@/app/samples/completedHunt"
import sample2 from "@/app/samples/activeHunt";
import sampleuser from "@/app/samples/user";

export default function Profile({params}: {params: {id: number}}) {
    
    //change to loading screen later
    // 
    return ( <main className="flex flex-col items-center gap-6 p-12">
        <div className="mt-16 flex flex-row justify-between gap-16">

        </div>
    </main>);
}