'use client';
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsAndPrivacy = () => {
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h2" gutterBottom>
                    Terms of Use and Privacy Policy
                </Typography>

                <Typography variant="h4" gutterBottom>
                    1. Introduction
                </Typography>
                <Typography paragraph>
                    Welcome to OpenHouses.ie! By using our platform, you agree to the following Terms of Use and Privacy Policy. Please read them carefully.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    2. Use of the Platform
                </Typography>
                <Typography paragraph>
                    OpenHouses.ie is a platform for advertising rental properties. We are not responsible for any transactions made between users, as we only provide the space for advertisements.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    3. Confidentiality and Data Protection
                </Typography>
                <Typography paragraph>
                    We are committed to maintaining the confidentiality and security of your information. Any data you provide to us will be processed in accordance with the applicable data protection laws, including the General Data Protection Regulation (GDPR).
                </Typography>

                <Typography variant="h4" gutterBottom>
                    4. User Responsibilities
                </Typography>
                <Typography paragraph>
                    Users are responsible for the accuracy of the information they provide and for their interactions with other users. We do not verify the content or the quality of the advertisements posted.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    5. Limitation of Liability
                </Typography>
                <Typography paragraph>
                    OpenHouses.ie shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from any use or inability to use the service.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    6. Privacy Policy
                </Typography>
                <Typography variant="h5" gutterBottom>
                    6.1 Information Collection
                </Typography>
                <Typography paragraph>
                    We collect information that you provide when you register, create an advertisement, or contact us. This information may include your name, email address, phone number, and property details.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    6.2 Use of Information
                </Typography>
                <Typography paragraph>
                    The information collected is used to provide and improve our services, to contact you about your advertisements, and to ensure compliance with our terms and policies.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    6.3 Data Sharing
                </Typography>
                <Typography paragraph>
                    We do not share your personal information with third parties except as necessary to provide our services or as required by law.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    6.4 Data Security
                </Typography>
                <Typography paragraph>
                    We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    7. Changes to Terms and Privacy Policy
                </Typography>
                <Typography paragraph>
                    We may update these Terms of Use and Privacy Policy from time to time. We will notify you of any changes by posting the new terms on our platform. You are advised to review these terms periodically for any changes.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    8. Contact Us
                </Typography>
                <Typography paragraph>
                    If you have any questions about these Terms of Use and Privacy Policy, please contact us at support@openhouses.ie.
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsAndPrivacy;
