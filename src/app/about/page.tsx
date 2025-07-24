import React from 'react'
import Styles from './page.module.css'
import { Handshake, Mail, UserSearch, Zap } from 'lucide-react'
import Button from '@/ui/button/Button'
import Storycard from '@/ui/card/Storycard'

export default function page() {
    return (
        <section className='section'>
            <div className={Styles.container}>
<div className={Styles.leftColumn}>
  <Storycard
    icon="Smile"
    title="Who We Are"
    subtitle="Youth-Led. Purpose-Driven. People-Focused."
    text={[
      `Hashi Ekshathe is a nonprofit organization founded and led by students from across Bangladesh. We work hand-in-hand to support vulnerable communities during times of crisis — from natural disasters to social and economic hardships. Our name means "Together with a Smile," symbolizing our belief in unity, hope, and the power of small acts of kindness.`,
      `Through food drives, education support, healthcare assistance, and more, we are building a future where empathy guides action. Our volunteers are high school and university students who bring not just energy but genuine care to everything we do — proving that youth can lead meaningful change, even with limited resources.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Founding"
    subtitle="A Story of Urgency and Unity"
    text={[
      `Hashi Ekshathe began during a time of hardship, when a group of students noticed how many families around them were struggling to access basic needs. With no formal structure, just the will to help, they began distributing food, water, and warm clothing to affected communities.`,
      `Hashi Ekshathe began during a time of hardship, when a group of students noticed how many families around them were struggling to access basic needs. With no formal structure, just the will to help, they began distributing food, water, and warm clothing to affected communities.`,
      `What started as scattered acts of kindness grew into an organized effort to reach more people, more efficiently, and with greater impact. Our founding spirit was rooted in youth solidarity, and even today, that same spirit fuels every step we take. We are proud of our student-led legacy and remain grounded in the belief that young people are capable of extraordinary things.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Mission & Vision"
    subtitle="Compassion in Action"
    text={[
      `Our mission is to mobilize student communities to tackle social issues with empathy, innovation, and urgency. We aim to be a bridge between those who want to help and those who need it most — addressing immediate needs while working toward long-term social development.`,
      `Our vision is a Bangladesh where every child can learn, every family can live with dignity, and every person in need can find support. We dream of a society that embraces compassion not as charity, but as responsibility — where youth lead with courage, and kindness shapes national progress.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Our Initiatives"
    subtitle="Serving with Purpose"
    text={[
      `From distributing heatwave relief in Dhaka and Rangpur to providing educational kits and Eid meals to underserved communities, our initiatives span across seasons and causes. Every project is needs-based, community-driven, and executed by our student volunteers.`,
      `Our work includes: food distribution during Ramadan and Eid, clean water access, education support, winter clothing drives, and emergency response during floods and climate events. We’re now working on ‘HaateKhori’ — an initiative to rebuild rural schools and ensure quality education for children across Bangladesh.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Our Leadership"
    subtitle="Led by Passion, Guided by Purpose"
    text={[
      `Hashi Ekshathe is powered by a dynamic team of high school and university students who manage both field operations and strategic direction. Our core leadership includes an Executive Director, Chief Operating Officer, departmental heads, and a collaboration board that works closely with other NGOs and civic organizations.`,
      `Every team member brings unique expertise — from logistics and media to community outreach and development. Despite being students, we maintain a highly organized internal structure, regular evaluations, and open communication, ensuring transparency and accountability in everything we do.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Organisation Structure"
    subtitle="Student-Led, Departmentally Run"
    text={[
      `Our organizational structure is divided into six core departments: Human Resources, Finance & Accounting, Outreach & Sponsorship, Partnership & Development, Communications & Marketing, and Digital Operations. Each department is led by a Director and supported by coordinators and volunteers.`,
      `Alongside these, our Admin Wing includes top-level leadership responsible for decision-making, strategic oversight, and inter-organizational collaboration. We also maintain a Collaboration Board to foster transparency and cooperative development with other organizations.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Organisation Policies & Principles"
    subtitle="Grounded in Ethics and Equity"
    text={[
      `Hashi Ekshathe operates with a strong commitment to ethical service, inclusivity, and respect for all. We follow documented policies on child protection, anti-discrimination, volunteer rights, data privacy, and financial transparency.`,
      `Every member is trained in our code of conduct, and we maintain internal review processes to ensure that our operations align with our values. We believe service must never come at the cost of dignity, and transparency must guide every partnership and donation.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Regional Presence"
    subtitle="Across Cities and Villages"
    text={[
      `While our central leadership is based in Dhaka, Hashi Ekshathe operates across multiple districts including Rangpur, Cumilla, and other rural regions. Our regional projects are implemented by volunteers familiar with local needs, ensuring cultural sensitivity and trust.`,
      `Whether responding to heatwaves in urban slums or distributing school supplies in remote areas, our regional teams allow us to remain agile and responsive. We continue to expand our presence to underserved areas with the goal of achieving nationwide impact.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Volunteer Experience"
    subtitle="Growth Through Giving"
    text={[
      `Volunteering with Hashi Ekshathe isn’t just about service — it’s about becoming part of a community. Volunteers gain hands-on experience in project planning, team management, event execution, and digital campaigning — all while making real-world impact.`,
      `From high school students organizing winter drives to university students designing digital systems, every member plays a meaningful role. We also offer training, leadership opportunities, and recognition for outstanding contributors who embody our mission.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Impact Stories"
    subtitle="Lives Touched, Change Made"
    text={[
      `Behind every project lies a story — of a child who received their first set of school supplies, a mother who could cook a warm meal during Eid, or a rickshaw driver who found clean water during a heatwave.`,
      `These stories remind us why we serve. They are our motivation and our measure of success. As we grow, we continue to document and share these narratives, not just to inspire, but to build trust and foster transparency in everything we do.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />

  <Storycard
    icon="Mail"
    title="Acknowledgments & Gratitude"
    subtitle="Together, We Make Change"
    text={[
      `We extend our heartfelt thanks to every volunteer, donor, partner, and well-wisher who walks this journey with us. From student-run bake sales to institutional sponsorships from government ministries, your support fuels our mission.`,
      `We especially thank the Ministry of Defence for supporting our Ramadan & Eid initiatives, and our collaborating nonprofits who have strengthened our ability to serve. Hashi Ekshathe is a family — and you are an essential part of it.`
    ]}
    button1={{ label: 'Show More', variant: 'primary' }}
    button2={{ label: 'Learn More', variant: 'outlined', linkTo: '/about' }}
  />
</div>

                
                
                
                <div className={Styles.rightColumn}>

                    <div className={Styles.subCard}>
                        <div className={Styles.subCardHeader}>
                            <div className={Styles.title}>
                                <Mail className={Styles.icon} />
                                <h2>Details</h2>
                            </div>
                        </div>

                        <div className={Styles.subCardContentListItems}>
                            <div className={Styles.listItem}>
                                <h3 className='muted-text'>Founded</h3>
                                <h3>2024</h3>
                            </div>

                            <div className={Styles.listItem}>
                                <h3 className='muted-text'>Founded</h3>
                                <h3>2024</h3>
                            </div>

                            <div className={Styles.listItem}>
                                <h3 className='muted-text'>Founded</h3>
                                <h3>2024</h3>
                            </div>
                        </div>
                    </div>


                    <div className={Styles.subCard}>
                        <div className={Styles.subCardHeader}>
                            <div className={Styles.title}>
                                <Handshake className={Styles.icon} />
                                <h2>About Us</h2>
                            </div>
                        </div>

                        <div className={Styles.subCardContentButton}>
                            <Button
                                variant='outlined'
                                label='Constitution'
                            />

                            <Button
                                variant='outlined'
                                label='Privacy Policy'
                            />

                            <Button
                                variant='outlined'
                                label='Terms and Services'
                            />

                            <Button
                                variant='outlined'
                                label='Legal Documents'
                            />
                        </div>
                    </div>

                    <div className={Styles.subCard}>
                        <div className={Styles.subCardHeader}>
                            <div className={Styles.title}>
                                <Zap className={Styles.icon} />
                                <h2>Our Impact</h2>
                            </div>
                        </div>

                        <div className={Styles.subCardContentStats}>
                            <div className={Styles.statContainer}>
                                <h1>$3,110,000</h1>
                                <p className='muted-text'>Total Raised</p>
                            </div>

                            <div className={Styles.statContainer}>
                                <h1>22,000+</h1>
                                <p className='muted-text'>Beneficiaries</p>
                            </div>

                            <div className={Styles.statContainer}>
                                <h1>500</h1>
                                <p className='muted-text'>Volunteers</p>
                            </div>

                            <div className={Styles.statContainer}>
                                <h1>1,200+</h1>
                                <p className='muted-text'>Volunteer Hours</p>
                            </div>

                            <div className={Styles.statContainer}>
                                <h1>85</h1>
                                <p className='muted-text'>Locations</p>
                            </div>
                        </div>
                    </div>


                    <div className={Styles.subCard}>
                        <div className={Styles.subCardHeader}>
                            <div className={Styles.title}>
                                <Handshake className={Styles.icon} />
                                <h2>About Us</h2>
                            </div>
                        </div>

                        <div className={Styles.subCardContentButton}>
                            <Button
                                variant='primary'
                                label='Join Us'
                            />

                            <Button
                                variant='outlined'
                                label='Join Us'
                            />

                            <Button
                                variant='outlined'
                                label='Join Us'
                            />
                        </div>
                    </div>





                    <div className={Styles.subCard}>
                        <div className={Styles.subCardHeader}>
                            <div className={Styles.title}>
                                <Zap className={Styles.icon} />
                                <h2>Follow Us</h2>
                            </div>
                        </div>

                        <div className={Styles.subCardContentIconButton}>
                            <Button
                                variant='icon'
                                icon='facebook'
                                showIcon
                            />

                            <Button
                                variant='icon'
                                icon='twitter'
                                showIcon
                            />

                            <Button
                                variant='icon'
                                icon='instagram'
                                showIcon
                            />

                            <Button
                                variant='icon'
                                icon='linkedin'
                                showIcon
                            />
                        </div>
                    </div>








                </div>
            </div>
        </section>
    )
}
