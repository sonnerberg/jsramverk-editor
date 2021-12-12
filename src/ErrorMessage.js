export function ErrorMessage({ error }) {
  return (
    <div
      style={{
        color: 'red',
        position: 'absolute',
        top: '0',
        width: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign: 'center',
      }}
    >
      {error}
    </div>
  );
}
