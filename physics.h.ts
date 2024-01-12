type MatterEntityWrapper<T extends keyof typeof Matter, P> = {
  [K in keyof typeof Matter[T] as typeof Matter[T][K] extends (...args: any) => any
    ? K : never
  ]: typeof Matter[T][K] extends (...args: any) => any ? Parameters<typeof Matter[T][K]> : never
};

type PhysicsBody = {
  new<T extends Exclude<keyof typeof Matter.Bodies, "prototype">>(
    type: T,
    ...args: Parameters<typeof Matter.Bodies[T]>
  ): MatterEntityWrapper<"Body", Body>
};