import React from 'react';
import Styles from './page.module.css';
import BentoGrid from '@/ui/Grid/BentoGrid';
import Button from '@/ui/button/Button';
import { Award } from 'lucide-react';

const items = [
  {
    id: 'item-1',
    content: (
      <div className={Styles.bentoContainer}>
        <div className={Styles.bentoContainerIconContainer}>
          <Award className={Styles.bentoContainerIcon} />
        </div>
        <h1 className={Styles.bentoContainertitle}>Title</h1>
        <p className={Styles.bentoContainerDescription}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum eveniet
          expedita quod porro quam? Itaque, delectus, libero tempore veniam id nostrum
          autem neque vel, corrupti expedita voluptates provident. Voluptatibus,
          recusandae!
        </p>
        <div className={Styles.bentoContainerButtonContainer}>
          <div>
            <Button variant="primary" label="see more" showIcon />
          </div>
          <Button variant="outlined" label="actions" />
        </div>
      </div>
    ),
  },
  { id: 'item-2', content: <div className={Styles.bentoContainer}>1</div> },
  { id: 'item-3', content: <div className={Styles.bentoContainer}>1</div> },
  { id: 'item-4', content: <div className={Styles.bentoContainer}>1</div> },
  {
    id: 'item-5',
    content: (
      <div className={Styles.bentoContainer}>
        <div className={Styles.bentoContainerIconContainer}>
          <Award className={Styles.bentoContainerIcon} />
        </div>
        <h1 className={Styles.bentoContainertitle}>Title</h1>
        <p className={Styles.bentoContainerDescription}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum eveniet
          expedita quod porro quam? Itaque, delectus, libero tempore veniam id nostrum
          autem neque vel, corrupti expedita voluptates provident. Voluptatibus,
          recusandae!
        </p>
        <div className={Styles.bentoContainerButtonContainer}>
          <div>
            <Button variant="primary" label="see more" showIcon />
          </div>
          <Button variant="outlined" label="actions" />
        </div>
      </div>
    ),
  },
  { id: 'item-6', content: <div className={Styles.bentoContainer}>1</div> },
  { id: 'item-7', content: <div className={Styles.bentoContainer}>1</div> },
  { id: 'item-8', content: <div className={Styles.bentoContainer}>1</div> },
  {
    id: 'item-9',
    content: (
      <div className={Styles.bentoContainer}>
        <div className={Styles.bentoContainerIconContainer}>
          <Award className={Styles.bentoContainerIcon} />
        </div>
        <h1 className={Styles.bentoContainertitle}>Title</h1>
        <p className={Styles.bentoContainerDescription}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum eveniet
          expedita quod porro quam? Itaque, delectus, libero tempore veniam id nostrum
          autem neque vel, corrupti expedita voluptates provident. Voluptatibus,
          recusandae!
        </p>
        <div className={Styles.bentoContainerButtonContainer}>
          <div>
            <Button variant="primary" label="see more" showIcon />
          </div>
          <Button variant="outlined" label="actions" />
        </div>
      </div>
    ),
  },
  { id: 'item-10', content: <div className={Styles.bentoContainer}>1</div> },
];

export default function Page() {
  return (
    <section className="section">
      <div className={Styles.container}>
        <BentoGrid items={items} />
      </div>
    </section>
  );
}
