import React from 'react'
import Styles from './AlertDialog.module.css'
import Button from '@/ui/button/Button';

interface AlertDialogProps {
    title?: string;
    description?: boolean;
}

export default function AlertDialog({
    title,
    description,
}: AlertDialogProps) {
    return (
        <div className={Styles.container}>
            <div>
                <h3 className={Styles.title}>Are you sure?</h3>
                <p className={Styles.description}>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Sequi delectus necessitatibus maiores nihil voluptatum!
                </p>
            </div>
            <div className={Styles.buttonContainer}>

                <Button
                    variant='outlined'
                    label='Cancel'
                />
                <Button
                    variant='primary'
                    label='Continue'
                />


            </div>
        </div>
    )
}