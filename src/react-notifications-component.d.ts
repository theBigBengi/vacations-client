declare module "react-notifications-component" {
  export const store: {
    addNotification: (notification: {
      title: string;
      message: string;
      type: "success" | "danger" | "info" | "default" | "warning";
      insert: "top" | "bottom";
      container: "top-left" | "top-right" | "bottom-left" | "bottom-right";
      animationIn: string[];
      animationOut: string[];
      dismiss: {
        duration: number;
        onScreen: boolean;
      };
    }) => void;
  };

  export const NotificationContainer: React.FC;
}
