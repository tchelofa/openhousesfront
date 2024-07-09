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
                    OpenHouses.ie is a platform for advertising rental properties. We are not responsible for any transactions made between users, as we only provide the space for advertisements. All transactions and interactions between landlords, landladies, tenants, and companies are conducted at their own risk.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    3. Confidentiality and Data Protection
                </Typography>
                <Typography paragraph>
                    We are committed to maintaining the confidentiality and security of your information. Any data you provide to us will be processed in accordance with the applicable data protection laws, including the General Data Protection Regulation (GDPR) and the Data Protection Acts 1988 to 2018.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    4. User Responsibilities
                </Typography>
                <Typography paragraph>
                    Users are responsible for the accuracy of the information they provide and for their interactions with other users. We do not verify the content or the quality of the advertisements posted. Users must ensure that their advertisements comply with all applicable laws and regulations, including the Residential Tenancies Act 2004.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    5. Limitation of Liability
                </Typography>
                <Typography paragraph>
                    OpenHouses.ie shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from any use or inability to use the service. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, as per the Civil Liability Act 1961.
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
                    We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction, in accordance with the GDPR and the ePrivacy Regulation (Regulation (EU) 2017/0003).
                </Typography>

                <Typography variant="h4" gutterBottom>
                    7. Changes to Terms and Privacy Policy
                </Typography>
                <Typography paragraph>
                    We may update these Terms of Use and Privacy Policy from time to time. We will notify you of any changes by posting the new terms on our platform. You are advised to review these terms periodically for any changes.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    8. Legal Compliance
                </Typography>
                <Typography paragraph>
                    These Terms of Use and Privacy Policy are governed by the laws of the Republic of Ireland. By using our platform, you agree to submit to the exclusive jurisdiction of the courts located in Ireland for the resolution of any disputes arising from or related to these terms or your use of the platform.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    9. Disclaimer
                </Typography>
                <Typography paragraph>
                    OpenHouses.ie makes no representations or warranties of any kind, express or implied, regarding the accuracy, reliability, or completeness of the content provided on the platform. We do not endorse any properties, landlords, tenants, or third-party service providers.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    10. Indemnity
                </Typography>
                <Typography paragraph>
                    You agree to indemnify and hold harmless OpenHouses.ie, its officers, directors, employees, and agents, from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or related to your use of the platform, your violation of these terms, or your violation of any rights of another.
                </Typography>

                <Typography variant="h4" gutterBottom>
                    11. Contact Us
                </Typography>
                <Typography paragraph>
                    If you have any questions about these Terms of Use and Privacy Policy, please contact us at support@openhouses.ie.
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsAndPrivacy;
