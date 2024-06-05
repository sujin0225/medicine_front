import React from 'react';
import Swal from "sweetalert2";

export const Myalert = async(icon: 'success' | 'error' | 'warning' | 'info' | 'question', title: string, text: string, confirmButtonText: string) => {
    return await Swal.fire({
        icon,
        title,
        text,
        confirmButtonText
    });
}

export const MyalertCancle = async(icon: 'success' | 'error' | 'warning' | 'info' | 'question', title: string, text: string, cancelButtonText: string, confirmButtonText: string) => {
    return await Swal.fire({
        icon,
        title,
        text,
        showCancelButton: true,
        cancelButtonText,
        confirmButtonText
    });
}