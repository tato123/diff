import React from "react";
import Button from "@atlaskit/button";
import EmptyState from "@atlaskit/empty-state";

const primaryAction = (
  <Button
    appearance="primary"
    onClick={() => console.log("primary action clicked")}
  >
    Primary action
  </Button>
);

const secondaryAction = (
  <Button onClick={() => console.log("secondary action clicked")}>
    Secondary action
  </Button>
);

const tertiaryAction = (
  <Button
    appearance="subtle-link"
    href="http://www.example.com"
    target="_blank"
  >
    Tertiary action
  </Button>
);

const props = {
  header: "Oh no, looks like you need a site",
  description: `You haven't added any prototypes yet, get started by adding a url in the website url.`,
  imageUrl:
    "https://cdn.dribbble.com/users/928676/screenshots/3921847/empty-state.png"
};

export default () => <EmptyState {...props} />;
