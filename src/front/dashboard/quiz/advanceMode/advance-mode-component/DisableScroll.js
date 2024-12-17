import { Backdrop } from '@mui/material';
import React from 'react'

const DisableScroll = (props) => {
    const [hasTriggered, setHasTriggered] = React.useState(false);

    const disableScroll = React.useCallback((e) => {
        if (["ibps"]?.includes(props?.watch("advance_mode_type"))) {
            e.preventDefault();
            setHasTriggered(true);
            setTimeout(function () {
                setHasTriggered(false);
            }, 2000);
        }
    }, []);
    React.useEffect(() => {
        window.addEventListener("wheel", disableScroll, { passive: false });

        return () => {
            window.removeEventListener("wheel", disableScroll);
        };
    }, []);
    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
                open={hasTriggered}
                onClick={() => setHasTriggered(false)}
            >
                Scroller is disabled.
            </Backdrop>
        </>
    )
}

export default DisableScroll
