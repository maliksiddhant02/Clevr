"use client";

import * as motion from "motion/react-client";

// Enter animation: headline first, subline follows. Both start 12px below,
// travel to rest. Spring on y for the settle, plain ease on opacity so the
// text doesn't ghost in behind itself.
export function HeroCopy() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { duration: 0.5, ease: "easeOut" },
          y: { type: "spring", visualDuration: 0.6, bounce: 0.2 },
        }}
        className="display text-paper text-[2.78rem]"
      >
        Pay by bank,
        <br />
        keep the fee
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.15,
          opacity: { duration: 0.5, ease: "easeOut" },
          y: { type: "spring", visualDuration: 0.6, bounce: 0.2 },
        }}
        className="text-paper mt-4 text-[1.0625rem] font-medium"
      >
        Nothing hidden. Your rules.
      </motion.p>
    </>
  );
}
