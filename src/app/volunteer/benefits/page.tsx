import React from 'react'
import Styles from './page.module.css'
import BentoGrid from '@/components/volunteer/BentoGrid';
import Button from '@/ui/button/Button';
import { Award } from 'lucide-react' 

const items = [
    <div className={Styles.bentoContainer}>
        <div className={Styles.bentoContainerIconContainer}>
            <Award className={Styles.bentoContainerIcon}/>
        </div>
        <h1 className={Styles.bentoContainertitle}>Title</h1>
        <p className={Styles.bentoContainerDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Dolorum eveniet expedita quod porro quam? Itaque, 
            delectus, libero tempore veniam id nostrum autem 
            neque vel, corrupti expedita voluptates provident. 
            Voluptatibus, recusandae!
            
        </p>
        <div className={Styles.bentoContainerButtonContainer}>
            <div><Button
                variant='primary'
                label='see more'
                showIcon
            /></div>
            <Button
                variant='outlined'
                label='actions'
            />
        </div>
    </div>,
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    <div className={Styles.bentoContainer}>1</div>,
    <div className={Styles.bentoContainer}>1</div>,
    <div className={Styles.bentoContainer}>1</div>,
    
    
    <div className={Styles.bentoContainer}>
        <div className={Styles.bentoContainerIconContainer}>
            <Award className={Styles.bentoContainerIcon}/>
        </div>
        <h1 className={Styles.bentoContainertitle}>Title</h1>
        <p className={Styles.bentoContainerDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Dolorum eveniet expedita quod porro quam? Itaque, 
            delectus, libero tempore veniam id nostrum autem 
            neque vel, corrupti expedita voluptates provident. 
            Voluptatibus, recusandae!
            
        </p>
        <div className={Styles.bentoContainerButtonContainer}>
            <div><Button
                variant='primary'
                label='see more'
                showIcon
            /></div>
            <Button
                variant='outlined'
                label='actions'
            />
        </div>
    </div>,


    <div className={Styles.bentoContainer}>1</div>,
    <div className={Styles.bentoContainer}>1</div>,
    <div className={Styles.bentoContainer}>1</div>,
    <div className={Styles.bentoContainer}>
        <div className={Styles.bentoContainerIconContainer}>
            <Award className={Styles.bentoContainerIcon}/>
        </div>
        <h1 className={Styles.bentoContainertitle}>Title</h1>
        <p className={Styles.bentoContainerDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Dolorum eveniet expedita quod porro quam? Itaque, 
            delectus, libero tempore veniam id nostrum autem 
            neque vel, corrupti expedita voluptates provident. 
            Voluptatibus, recusandae!
            
        </p>
        <div className={Styles.bentoContainerButtonContainer}>
            <div><Button
                variant='primary'
                label='see more'
                showIcon
            /></div>
            <Button
                variant='outlined'
                label='actions'
            />
        </div>
    </div>,
    <div className={Styles.bentoContainer}>1</div>,
];

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
                <BentoGrid items={items} />
            </div>
        </section>
    )
}