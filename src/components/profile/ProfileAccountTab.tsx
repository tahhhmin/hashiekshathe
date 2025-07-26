import React from 'react'
import LogoutButton from '../button/LogoutButton'
import Styles from './ProfileAccountTab.module.css'
import Button from '@/ui/button/Button'
import HorizontalDivider from '../dividers/HorizontalDivider'

export default function ProfileAccountTab() {
    return (
        <div className={Styles.container}>
            <div className={Styles.accountSettingsContainer}></div>

            <div>
                <LogoutButton />
            </div>

            <HorizontalDivider />

            <div className={Styles.dangerZoneContainer}>
                <div>
                    <h3 className={Styles.dangerZoneTitle}>Danger Zone</h3>
                    <p className='muted-text'>These actions are permanent and cannot be undone.</p>
                </div>
                <Button
                    variant='danger'
                    label='Delete account'
                    showIcon
                    icon='Trash2'
                />
            </div>
        </div>
    )
}
