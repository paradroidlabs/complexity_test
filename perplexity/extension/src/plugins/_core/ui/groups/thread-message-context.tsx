export const ThreadMessageContext = createContext<{
  messageBlockIndex: number;
}>({
  messageBlockIndex: 0,
});

export function ThreadMessageToolbarContextProvider({
  children,
  messageBlockIndex,
}: {
  children: React.ReactNode;
  messageBlockIndex: number;
}) {
  return (
    <ThreadMessageContext value={{ messageBlockIndex }}>
      {children}
    </ThreadMessageContext>
  );
}

export function useThreadMessageContext() {
  const context = useContext(ThreadMessageContext);

  if (!context) {
    throw new Error(
      "useThreadMessageContext must be used within a ThreadMessageContextProvider",
    );
  }

  return context;
}
