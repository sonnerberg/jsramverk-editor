export function SuccessMessage({ success }) {
  return (
    <div
      style={{
        color: 'green',
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
      {success}
    </div>
  );
}
