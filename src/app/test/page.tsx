"use client"

import React, { useState } from 'react';
import Styles from './page.module.css'
import Button from '@/ui/button/Button'
import Input from '@/ui/input/Input'
import ProgressBar from '@/ui/Progress/ProgressBar';
import CircleLoader from '@/ui/Progress/CircleLoader';
import Badge from '@/ui/badge/Badge';
import OTP from '@/ui/OTP/OTP';
import Textarea from '@/ui/input/Textarea';
import Seperator from '@/ui/seperator/Seperator';
import SelectInput from '@/ui/input/Select';
import Slider from '@/ui/slider/Slider';
import Switch from '@/ui/switch/Switch';
import Alert from '@/ui/alert/Alert';
import AlertDialog from '@/ui/alertDialog/AlertDialog';
import Storycard from '@/ui/card/Storycard';
import IndeterminateProgressBar from '@/ui/Progress/FreeProgressBar';

function page() {
      const [progress, setProgress] = useState(30);

       const [role, setRole] = useState<string | boolean>('');
  const [volume, setVolume] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Volunteer', value: 'volunteer' },
    { label: 'Visitor', value: 'visitor' },
    { label: 'Disabled', value: false },
  ];

    return (
        <div className={Styles.container}>
            <div className={Styles.inputs}>
                <h2>Accordion</h2>
            </div>

            <div className={Styles.inputs}>
                <h2>Alert / Popup Notification</h2>
                <Alert
                    variant="danger"
                    title="Access Denied"
                    description="You do not have permission to access this page."
                />


    <Alert
                    variant="warning"
                    title="Access Denied"
                    description="You do not have permission to access this page."
                />
                <Alert
                    variant="success"
                    title="Access Denied"
                    description="You do not have permission to access this page."
                />
                <Alert
                    variant="info"
                    title="Access Denied"
                    description="You do not have permission to access this page."
                />

                <Alert
                    variant="default"
                    title="Access Denied"
                    icon="Mail"
                    description="You do not have permission to access this page."
                />
            </div>

            <div className={Styles.AlertDialog}>
                <h2>Alert Dialog</h2>
                <AlertDialog
                
                />
            </div>

            <div className={Styles.inputs}>
                <h2>Avatar</h2>


                <div className={Styles.buttonAvatar}></div>

                <div className={Styles.cardAvatar}>
                    <div className={Styles.cardAvatarImage}></div>
                    <div className={Styles.cardAvatarTexts}>
                        <h3 className={Styles.cardAvatarName}>Mahdi Zarif</h3>
                        <p className={Styles.cardAvatarMail}>mahazi@gmail.com</p>
                    </div>
                </div>
            </div>



            <div className={Styles.badge}>
                <h2>Badge</h2>

                <Badge 
                    variant='primary'
                    label='Badge'
                    showIcon
                    icon='Mail'
                />

                <Badge 
                    variant='primary'
                    label='11'
                    showIcon={false}
                />
<Badge
  variant="variable"
  showIcon={true}
  icon="Star"
  label="Featured"
  bgcolor="#FFD700" // or "rgb(100, 200, 255)", or "var(--color-brand)"
/>

<Badge
  variant="variable"
  showIcon={true}
  icon="Smile"
  bgcolor="#e0ffe0"
/>

<Badge
  variant="variable"
  showIcon={true}
  icon="Rocket"
  label="Launched"
  bgcolor="#3D5AFE"
  textcolor="#FFFFFF"
/>

<Badge
  variant="variable"
  showIcon={true}
  icon="Sun"
  label="Morning"
  bgcolor="#FFF3CD"
  textcolor="#856404"
/>


            </div>





            <div className={Styles.buttons}>
                <h1>Buttons</h1>
                <span className={Styles.buttonsSpan}>
                
                    <Button
                        variant='primary'
                        label='Primary'
                        showIcon
                        icon='ArrowUpRight'
                    />

                    <Button
                        variant='secondary'
                        label='Secondary'
                        showIcon
                        icon='ArrowUpRight'
                    />

                    <Button
                        variant='outlined'
                        label='Outlined'
                        showIcon
                        icon='ArrowUpRight'
                    />

                    <Button
                        variant='icon'
                        showIcon
                        icon='ArrowUpRight' 
                    />

                    <Button
                        variant='danger'
                        label='Danger'
                        showIcon
                        icon='Trash2'
                    />

                    <Button
                        variant='submit'
                        label='Submit'
                        showIcon
                    />

                    <Button
                        variant='loading'
                        label='Submiting'
                        showIcon
                    />


                </span>

                <span className={Styles.buttonsSpan1}>
                
                    <Button
                        variant='primary'
                        label='Primary'
                        showIcon
                        icon='ArrowUpRight'
                    />

                    <Button
                        variant='secondary'
                        label='Secondary'
                        showIcon
                        icon='ArrowUpRight'
                    />

                    <Button
                        variant='outlined'
                        label='Outlined'
                        showIcon
                        icon='ArrowUpRight'
                    />

                    <Button
                        variant='icon'
                        showIcon
                        icon='ArrowUpRight' 
                    />

                    <Button
                        variant='danger'
                        label='Danger'
                        showIcon
                        icon='Trash2'
                    />

                    <Button
                        variant='submit'
                        label='Submit'
                        showIcon
                    />


                </span>
            </div>

            <div className={Styles.inputs}>
                <h2>Inputs</h2>
                <Input
                    type='text'
                    showIcon
                    showHelpText
                    icon='Text'
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />

                <Input
                    type='password'
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                    name=''
                    value=''
                />

                <Input
                    type='email'
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />

                <Input
                    type='number'
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />

                <Input
                    type='tel'
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />

                <Input
                    type='search'
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />

                <Input
                    type='url'
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />

                <Input
                    type='text' // file needs to be added
                    showIcon
                    showHelpText
                    placeholder='Placeholder'
                    label='Label'
                    helpText='This is the text below input'
                />
            </div>

            <div className={Styles.textarea}>
                <h2>Textarea</h2>
                <Textarea
                    placeholder='Placeholder'
                    label='Label'
                    showHelpText
                    helpText='Help text below'
                    value=''
                    onChange={() => {console.log('')}}
                />
            </div>

            <div className={Styles.inputs}>
                <h2>Select</h2>
                <SelectInput
                    label="Choose Role"
                    name="userRole"
                    value={role}
                    onChange={setRole}
                    required
                    showIcon
                    icon="User"
                    placeholder="Select user type"
                    showHelpText
                    helpText="Please choose your user role to continue."
                    options={roleOptions}
                />
            </div>

            <div className={Styles.inputs}>
                <h2>Slider</h2>
                <Slider
                    label="Volume"
                    name="volume"
                    value={volume}
                    onChange={setVolume}
                    min={0}
                    max={100}
                    step={5}
                    showValue
                />


            </div>

            <div className={Styles.inputs}>
                <h2>Switch</h2>
            <Switch
        checked={isDarkMode}
        onChange={setIsDarkMode}
        label="Dark Mode"
      />
       </div>

    / Date / Checkbox / Color / file / 


            <div className={Styles.inputs}>
                <h2>Input OTP</h2>
                <OTP 
                    label="Verification Code"
                    value=''
                    onChange={() => { console.log('it was clicked') }}
                    length={6}
                    autoFocus={true}
                    helpText="Enter the 6-digit verification code"
                />
            </div>

            <div className={Styles.inputs}>
                <h2>Dropdown</h2>
            </div>


            <div className={Styles.sheet}>
                <h2>Sheet</h2>
            </div>

            <div className={Styles.cards}>
                <h2>Cards</h2>
            </div>

            <div className={Styles.sidebar}>
                <h2>Sidebar</h2>
            </div>

            <div className={Styles.progress}>
                <h2>Progress</h2>
                <ProgressBar progress={progress} />
                <CircleLoader />
                <CircleLoader size={60} color="#007bff" thickness={6} />
                <CircleLoader size="2rem" color="#333" backgroundColor="#ddd" thickness={3} />
                <IndeterminateProgressBar />
            </div>

            <div className={Styles.seperator}>
                <h2>Seperator</h2>
                <div className={Styles.seperatorContainer}>
                <Seperator />
                <Seperator variant="vertical" />
                <Seperator backgroundColor="#ff6600" length={4} />
                <Seperator variant="vertical" backgroundColor="#999" length="60px" />
                </div>
            </div>

            <div className={Styles.progress}>
                <h2>Card</h2>


            </div>
        </div>
    )
}

export default page