import { ActionIcon, Anchor, Group, Image } from '@mantine/core';
import classes from './FooterCentered.module.css';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from 'react-icons/fa';
import logo_black from '../../../../assets/img/logo_black.svg';
import { RiTwitterXFill } from 'react-icons/ri';

const links = [
    { link: '#', label: 'Privacy Policy' },
    { link: '#', label: 'Terms and Conditions' },
];

export function PublicFooter() {
    const items = links.map((link) => (
        <Anchor
            c="dimmed"
            key={link.label}
            href={link.link}
            lh={1}
            onClick={(event) => event.preventDefault()}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <div className={classes.inner}>
                <Group >
                <Image h={36} src={logo_black} />
                </Group>
                <Group className={classes.links}>{items}</Group>
                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://www.instagram.com/getdaywaka/', '_blank')}>
                        <FaInstagram size={18}  />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://www.tiktok.com/@tiktok.com/@getdaywaka?lang=en-gb', '_blank')}>
                        <FaTiktok size={18}  />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://www.facebook.com/facebook.com/profile.php?id=61577916102722', '_blank')}>
                        <FaFacebook size={18}  />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://www.youtube.com/@getdaywaka', '_blank')}>
                        <FaYoutube size={18}  />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://x.com/x.com/getdaywaka', '_blank')}>
                        <RiTwitterXFill size={18}  />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('http://linkedin.com/in/day-waka-9baa30373', '_blank')}>
                        <FaLinkedin size={18}  />
                    </ActionIcon>
                </Group>
            </div>
        </div>
    );
}