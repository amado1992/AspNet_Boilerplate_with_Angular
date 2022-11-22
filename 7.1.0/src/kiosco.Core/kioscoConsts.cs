using kiosco.Debugging;

namespace kiosco
{
    public class kioscoConsts
    {
        public const string LocalizationSourceName = "kiosco";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "bfdd7ee4d51d41109001e42640d83eeb";
    }
}
