import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  userName: string;
  verificationLink: string;
}

export const VerifyEmail = ({
  userName,
  verificationLink,
}: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your email</Heading>
        <Text style={text}>Hello {userName},</Text>
        <Text style={text}>
          Thank you for signing up. We just need to verify your email address to
          complete your registration.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verify Email Address
          </Button>
        </Section>
        <Text style={text}>
          This link will expire in 24 hours. If you didn't request this
          verification, you can safely ignore this email.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you're having trouble clicking the button, copy and paste the URL
          below into your web browser:
        </Text>
        <Link href={verificationLink} style={reportLink}>
          {verificationLink}
        </Link>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingBottom: "10px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const reportLink = {
  color: "#0070f3",
  fontSize: "14px",
  textDecoration: "underline",
};

export default VerifyEmail;
