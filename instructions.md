# Mercury-Messenger Project Rules

## Core Tech Stack
- Frontend: Angular 18+ (Zoneless mode enabled)
- Backend: Node.js with TypeScript (ES Modules)
- Communication: Socket.io for real-time events

## AI Behavior Instructions
1. **Signal First:** Always use Angular Signals for state management; avoid `BehaviorSubject` unless RxJS interop is strictly required.
2. **Clean Engineering:** Prioritize "engineering" over "coding"—always include unit test stubs (Jasmine/TestBed) for new services.
3. **No Spaghetti:** Use a dedicated `core/services` folder for the Socket.io logic to keep components "thin".
4. **Optimistic UI:** When suggesting messaging logic, always implement an optimistic update pattern where the UI updates before the server acknowledgment.
5. **Modern Syntax:** Use ESM `import` statements and strictly typed TypeScript interfaces for all socket payloads.
6.